"use client";

import { useMemo, useState } from "react";

type AgentCardProps = {
  name: string;
  role: string;
  issueCount: number;
  details?: string[];
};

export default function AgentCard({
  name,
  role,
  issueCount,
  details = [],
}: AgentCardProps) {
  const [open, setOpen] = useState(false);

  const safeDetails = useMemo(() => {
    // 혹시 undefined/빈값 섞여 들어오면 제거
    return (details ?? []).map((d) => String(d)).filter((d) => d.trim().length > 0);
  }, [details]);

  return (
    <>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg text-slate-800">{name}</h3>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-400 font-semibold">교정 필요</p>

            {/* ✅ 숫자 클릭 -> 모달 열기 */}
            <button
  type="button"
  onClick={() => issueCount > 0 && setOpen((prev) => !prev)}
  className={`text-2xl font-black ${
    issueCount === 0 ? "text-emerald-500 cursor-default" : "text-red-500 hover:underline"
  }`}
>
  {issueCount}
</button>
          </div>
        </div>

        {/* ✅ 카드 내부 상세내역: 대표 3개는 보이되, 박스 안에서 스크롤 가능 */}
        {issueCount === 0 ? (
          <p className="text-xs text-emerald-600">✅ 모든 데이터가 완벽합니다</p>
        ) : safeDetails.length > 0 ? (
          <div className="space-y-2">

            {/* ✅ 여기서 휠로 스크롤하면 다음 내역도 볼 수 있음 */}
            <div className="max-h-28 overflow-y-auto pr-1 space-y-2">
              {safeDetails.slice(0, 3).map((d, i) => (
                <div key={i} className="bg-slate-50 p-2 rounded text-xs text-slate-600">
                  {d}
                </div>
              ))}
            </div>

            {/* 대표 3개를 “의미적으로” 강조하고 싶으면 아래 줄을 살려도 됨 (지금은 전체 스크롤 방식) */}
            {/* <p className="text-[10px] text-slate-400">대표 3개가 먼저 보이고, 스크롤하면 전체를 확인할 수 있어요.</p> */}
          </div>
        ) : (
          <p className="text-xs text-slate-500">일부 항목에 수정이 필요합니다.</p>
        )}
      </div>

      {/* ✅ (2) 모달: 교정 필요 숫자 클릭하면 작은 직사각형으로 상세 띄우기 */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-xl bg-white border border-slate-200 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between p-4 border-b border-slate-200">
              <div>
                <p className="text-sm font-bold text-slate-800">{name}</p>
                <p className="text-xs text-slate-500">교정 필요 {issueCount}건</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-slate-500 hover:text-slate-800 text-sm"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              <div className="max-h-80 overflow-y-auto pr-1 space-y-2">
                {safeDetails.length === 0 ? (
                  <p className="text-sm text-slate-500">표시할 상세내역이 없습니다.</p>
                ) : (
                  safeDetails.map((d, i) => (
                    <div key={i} className="bg-slate-50 p-2 rounded text-sm text-slate-700">
                      {d}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}