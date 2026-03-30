import * as XLSX from "xlsx";

type Row = Record<string, any>;

function norm(v: any) {
  return String(v ?? "").trim();
}

function normKey(v: any) {
  return norm(v).replace(/\s+/g, " ");
}

function isEmptyRow(row: any[]) {
  return row.every((cell) => norm(cell) === "");
}

/**
 * 헤더 행 자동 탐지
 * - 상위 헤더 행: 기업명, 상담구분, 통화결과, 상담원 같은 대표 컬럼이 있는 행
 * - 하위 헤더 행: 경로, 경로상세, 대분류, 중분류, 소분류 같은 세부 컬럼이 있는 행
 */
function detectHeaderRows(table: any[][]) {
  let topHeaderIndex = -1;
  let subHeaderIndex = -1;

  const scanLimit = Math.min(table.length, 10);

  for (let i = 0; i < scanLimit; i++) {
    const row = table[i] ?? [];
    const values = row.map(normKey);

    const topScore = [
      values.some((v) => v.includes("기업명")),
      values.some((v) => v.includes("상담구분")),
      values.some((v) => v.includes("통화결과")),
      values.some((v) => v.includes("상담원")),
      values.some((v) => v.includes("상담경로") || v.includes("상담분류")),
    ].filter(Boolean).length;

    if (topScore >= 3) {
      topHeaderIndex = i;
      break;
    }
  }

  if (topHeaderIndex === -1) {
    topHeaderIndex = 0;
  }

  const nextRow = table[topHeaderIndex + 1] ?? [];
  const nextValues = nextRow.map(normKey);

  const hasSubHeaders =
    nextValues.some((v) => v.includes("경로")) ||
    nextValues.some((v) => v.includes("경로상세")) ||
    nextValues.some((v) => v.includes("대분류")) ||
    nextValues.some((v) => v.includes("중분류")) ||
    nextValues.some((v) => v.includes("소분류"));

  subHeaderIndex = hasSubHeaders ? topHeaderIndex + 1 : topHeaderIndex;

  return { topHeaderIndex, subHeaderIndex };
}

/**
 * 헤더 2줄(상위/하위) 병합 + 상위헤더 forward-fill
 */
function sheetToRowsWithDetectedHeaders(sheet: XLSX.WorkSheet) {
  const table = XLSX.utils.sheet_to_json<any[]>(sheet, {
    header: 1,
    defval: "",
  }) as any[][];

  const { topHeaderIndex, subHeaderIndex } = detectHeaderRows(table);

  const topRaw = table[topHeaderIndex] ?? [];
  const subRaw = table[subHeaderIndex] ?? [];

  const len = Math.max(topRaw.length, subRaw.length);

  const top: string[] = [];
  let lastTop = "";

  for (let i = 0; i < len; i++) {
    const t = normKey(topRaw[i]);
    if (t) lastTop = t;
    top[i] = lastTop;
  }

  const sub: string[] = [];
  for (let i = 0; i < len; i++) {
    sub[i] = normKey(subRaw[i]);
  }

  const keys = Array.from({ length: len }, (_, i) => {
    const t = top[i];
    const s = sub[i];

    if (topHeaderIndex === subHeaderIndex) {
      return t || `COL_${i}`;
    }

    if (t && s && t !== s) return `${t}_${s}`;
    if (t && !s) return t;
    if (!t && s) return s;
    if (t && s && t === s) return t;
    return `COL_${i}`;
  });

  const dataStartIndex = subHeaderIndex + 1;
  const dataRows = table.slice(dataStartIndex).filter((row) => !isEmptyRow(row));

  const rows = dataRows.map((arr) => {
    const row: Row = {};
    keys.forEach((k, i) => {
      row[k] = arr[i] ?? "";
    });
    return row;
  });

  return {
    rows,
    keys,
    headerInfo: {
      topHeaderIndex,
      subHeaderIndex,
      dataStartIndex,
    },
  };
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

  const { rows, keys, headerInfo } = sheetToRowsWithDetectedHeaders(sheet);

  const allKeys = keys;

  // 기본 컬럼 자동 탐지
  const agentKey =
    pickKey(allKeys, ["상담원"]) ||
    pickKey(allKeys, ["팀", "상담원"]) ||
    pickKey(allKeys, ["상담", "상담원"]);

  const companyKey = pickKey(allKeys, ["기업명"]);
  const divisionKey = pickKey(allKeys, ["상담구분"]);
  const resultKey = pickKey(allKeys, ["통화결과"]);

  // 상담경로/경로상세 자동 탐지
  const pathKey =
    pickKey(allKeys, ["상담경로", "경로"], ["상세"]) ||
    pickKey(allKeys, ["경로"], ["상세"]);

  const pathDetailKey =
    pickKey(allKeys, ["상담경로", "경로상세"]) ||
    pickKey(allKeys, ["경로상세"]);

  const HUNET_NAMES = new Set(["(주)휴넷", "㈜휴넷"]);

  const byAgent: Record<string, { issueCount: number; details: string[] }> = {};

  rows.forEach((row, idx) => {
    const rowNo = headerInfo.dataStartIndex + idx + 1;

    const agent = norm(agentKey ? row[agentKey] : "") || "미지정";

    if (!byAgent[agent]) {
      byAgent[agent] = { issueCount: 0, details: [] };
    }

    const pushIssue = (msg: string) => {
      byAgent[agent].issueCount += 1;
      byAgent[agent].details.push(`Row ${rowNo}: ${msg}`);
    };

    // 기업명
    const company = norm(companyKey ? row[companyKey] : "");
    if (!company) pushIssue("기업명 공란");

    // 상담구분
    const division = norm(divisionKey ? row[divisionKey] : "");
    if (!division) pushIssue("상담구분 공란");

    // 통화결과
    const result = norm(resultKey ? row[resultKey] : "");
    if (!result) pushIssue("통화결과 공란");

    // 상담경로
    const path = norm(pathKey ? row[pathKey] : "");
    const pathDetail = norm(pathDetailKey ? row[pathDetailKey] : "");

    if (!path) {
      pushIssue("상담경로-경로 공란");
    } else if (path === "아웃바운드") {
      if (!pathDetail) pushIssue("아웃바운드인데 경로상세 공란");
    }

    // 휴넷 -> 상담구분 B2C
    if (company && HUNET_NAMES.has(company)) {
      if (division.toUpperCase() !== "B2C") {
        pushIssue(`휴넷(${company})인데 상담구분이 B2C가 아님 (${division || "공란"})`);
      }
    }
  });

  const agents = Object.entries(byAgent)
    .map(([name, v]) => ({
      name,
      role: "",
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
      allKeys,
      headerInfo,
    },
    agents,
  });
}