import * as XLSX from "xlsx";

type Row = Record<string, any>;

function norm(v: any) {
  return String(v ?? "").trim();
}

function normKey(v: any) {
  // 헤더 셀에 줄바꿈/여러 공백이 들어오는 경우가 있어서 정리
  return norm(v).replace(/\s+/g, " ");
}

/**
 * 2줄 헤더(상위/하위) 병합 + 상위헤더 forward-fill
 */
function sheetToRowsWith2Headers(sheet: XLSX.WorkSheet) {
  const table = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1, defval: "" }) as any[][];
  const topRaw = table[0] ?? [];
  const subRaw = table[1] ?? [];

  const len = Math.max(topRaw.length, subRaw.length);

  // 상위 헤더 forward-fill
  const top: string[] = [];
  let lastTop = "";
  for (let i = 0; i < len; i++) {
    const t = normKey(topRaw[i]);
    if (t) lastTop = t;
    top[i] = lastTop; // 빈칸이면 이전 값
  }

  const sub: string[] = [];
  for (let i = 0; i < len; i++) sub[i] = normKey(subRaw[i]);

  // 키 생성
  const keys = Array.from({ length: len }, (_, i) => {
    const t = top[i];
    const s = sub[i];

    if (t && s) return `${t}_${s}`; // 상담경로_경로, 상담경로_경로상세
    if (t && !s) return t;          // 상담원, 기업명 같은 단일 컬럼
    if (!t && s) return s;
    return `COL_${i}`;
  });

  // 데이터(3행부터)
  const dataRows = table.slice(2);

  return dataRows.map((arr) => {
    const row: Row = {};
    keys.forEach((k, i) => {
      row[k] = arr[i] ?? "";
    });
    return row;
  });
}

/**
 * rows의 실제 key 목록에서 패턴에 맞는 컬럼을 자동으로 찾는다.
 * - tokens: 모두 포함해야 함
 * - notTokens: 하나라도 포함하면 제외
 */
function pickKey(allKeys: string[], tokens: string[], notTokens: string[] = []) {
  const t = tokens.map((x) => x.toLowerCase());
  const n = notTokens.map((x) => x.toLowerCase());

  return (
    allKeys.find((k) => {
      const kk = k.toLowerCase();
      if (n.some((x) => kk.includes(x))) return false;
      return t.every((x) => kk.includes(x));
    }) ?? ""
  );
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return new Response("file is required", { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const wb = XLSX.read(arrayBuffer, { type: "array" });
  const sheet = wb.Sheets[wb.SheetNames[0]];

  const rows = sheetToRowsWith2Headers(sheet);

  const first = rows[0] ?? {};
  const allKeys = Object.keys(first);

  // ✅ 기본 컬럼들 자동 탐지(너 헤더 기반)
  const agentKey = pickKey(allKeys, ["상담원"]);
  const companyKey = pickKey(allKeys, ["기업명"]);
  const divisionKey = pickKey(allKeys, ["상담구분"]);
  const resultKey = pickKey(allKeys, ["통화결과"]);

  // ✅ 상담경로/경로상세 자동 탐지(핵심!)
  // '경로'는 '경로상세'가 아닌 컬럼을 선택
  const pathKey =
    pickKey(allKeys, ["상담경로", "경로"], ["상세"]) ||
    pickKey(allKeys, ["경로"], ["상세"]); // fallback: 그냥 '경로'

  const pathDetailKey =
    pickKey(allKeys, ["상담경로", "경로상세"]) ||
    pickKey(allKeys, ["경로상세"]); // fallback: 그냥 '경로상세'

  // 휴넷 인정 기업명
  const HUNET_NAMES = new Set(["(주)휴넷", "㈜휴넷"]);

  const byAgent: Record<string, { issueCount: number; details: string[] }> = {};

  rows.forEach((row, idx) => {
    const rowNo = idx + 3; // 헤더 2줄 가정

    const agent = norm(agentKey ? row[agentKey] : "") || "미지정";
    if (!byAgent[agent]) byAgent[agent] = { issueCount: 0, details: [] };

    const pushIssue = (msg: string) => {
      byAgent[agent].issueCount += 1;
      byAgent[agent].details.push(`Row ${rowNo}: ${msg}`);
    };

    // 1) 기업명 공란이면 오류
    const company = norm(companyKey ? row[companyKey] : "");
    if (!company) pushIssue("기업명 공란");

    // 2) 상담구분 공란이면 오류
    const division = norm(divisionKey ? row[divisionKey] : "");
    if (!division) pushIssue("상담구분 공란");

    // 3) 통화결과 공란이면 오류
    const result = norm(resultKey ? row[resultKey] : "");
    if (!result) pushIssue("통화결과 공란");

    // 4) 상담경로 규칙
    // - 경로는 필수
    // - 아웃바운드일 때만 경로상세 필수
    // - 인바운드는 경로상세 검사 안 함
    const path = norm(pathKey ? row[pathKey] : "");
    const pathDetail = norm(pathDetailKey ? row[pathDetailKey] : "");

    if (!path) {
      pushIssue("상담경로-경로 공란(컬럼 인식 실패 가능)");
    } else if (path === "아웃바운드") {
      // pathDetailKey를 못 찾으면 폭발할 수 있으니, 그 경우는 규칙을 적용하지 않고 안내만 남김
      if (!pathDetailKey) {
        pushIssue("경로상세 컬럼을 찾지 못함(헤더 구조 확인 필요)");
      } else if (!pathDetail) {
        pushIssue("아웃바운드인데 경로상세 공란");
      }
    }

    // 5) 휴넷이면 상담구분은 무조건 B2C (대소문자 무시)
    if (company && HUNET_NAMES.has(company)) {
      if (division.toUpperCase() !== "B2C") {
        pushIssue(`휴넷(${company})인데 상담구분이 B2C가 아님 (${division || "공란"})`);
      }
    }
  });

  const agents = Object.entries(byAgent)
    .map(([name, v]) => ({
      name,
      role: "UNKNOWN",
      issueCount: v.issueCount,
      details: v.details,
    }))
    .sort((a, b) => b.issueCount - a.issueCount);

  return Response.json({
    ok: true,
    rowCount: rows.length,
    detectedKeys: {
      agentKey,
      companyKey,
      divisionKey,
      resultKey,
      pathKey,
      pathDetailKey,
    },
    agents,
  });
}