// lib/uploadStore.ts
export type Agent = {
    name: string;
    issueCount: number;
    details?: string[];
    // role은 지금 화면에서 안 쓰면 없어도 됨
    role?: string;
};

export type AnalysisSnapshot = {
    ok: boolean;
    rowCount: number;
    agents: Agent[];
    fileName: string;
};

export type UploadStatus = "완료" | "업로드 불가";

export type UploadHistoryItem = {
    id: string;            // 고유 id
    uploadedAt: string;    // ISO 문자열
    fileName: string;
    rowCount: number;
    issueTotal: number;    // 실패 칼럼(=교정필요 총합)
    status: UploadStatus;
    analysis?: AnalysisSnapshot; // 완료면 저장, 실패면 없음
};

const HISTORY_KEY = "cc_upload_history_v1";
const ACTIVE_KEY = "cc_active_upload_id_v1";

function safeParse<T>(raw: string | null, fallback: T): T {
    try {
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

export function getHistory(): UploadHistoryItem[] {
    if (typeof window === "undefined") return [];
    return safeParse<UploadHistoryItem[]>(localStorage.getItem(HISTORY_KEY), []);
}

export function setHistory(items: UploadHistoryItem[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
}

export function addHistory(item: UploadHistoryItem) {
    const prev = getHistory();
    setHistory([item, ...prev]); // 최신이 위로
}

export function setActiveUploadId(id: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACTIVE_KEY, id);
}

export function getActiveUploadId(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACTIVE_KEY);
}

export function getActiveAnalysis(): AnalysisSnapshot | null {
    const activeId = getActiveUploadId();
    if (!activeId) return null;

    const items = getHistory();
    const found = items.find((x) => x.id === activeId);
    return found?.analysis ?? null;
}

export function formatKST(iso: string) {
    // 로컬 PC 시간 기준으로 보기 좋게 출력
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
        d.getHours()
    )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}