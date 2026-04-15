"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  formatKST,
  getHistory,
  setActiveUploadId,
  type UploadHistoryItem,
} from "@/lib/uploadStore";

export default function UploadsPage() {
  const router = useRouter();
  const [items, setItems] = useState<UploadHistoryItem[]>([]);

  useEffect(() => {
    setItems(getHistory());
  }, []);

  function onApply(id: string) {
    setActiveUploadId(id);
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white font-bold">
                AI
              </div>
              <h1 className="text-lg font-bold">상담원 데이터 교정 대시보드</h1>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-slate-500 text-sm hover:text-blue-600 transition-colors"
              >
                대시보드
              </Link>
              <Link
                href="/uploads"
                className="text-blue-600 font-semibold text-sm"
              >
                업로드 이력
              </Link>
            </nav>
          </div>

          <div className="text-sm text-slate-500">업로드 이력</div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="mb-6">
          <h2 className="mb-1 text-3xl font-black">엑셀 데이터 업로드 이력</h2>
          <p className="text-sm text-slate-500">
            업로드된 파일의 처리 상태를 확인하세요.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">No</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">업로드 일시</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">파일명</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">총 데이터</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-red-500">실패</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">상태</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase text-slate-500">적용</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-400">
                      아직 업로드 이력이 없습니다.
                    </td>
                  </tr>
                ) : (
                  items.map((it, idx) => (
                    <tr key={it.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {items.length - idx}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium">
                        {formatKST(it.uploadedAt)}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold">{it.fileName}</td>

                      <td className="px-6 py-4 text-sm">
                        {it.rowCount ? it.rowCount.toLocaleString() : "-"}
                      </td>

                      <td
                        className={`px-6 py-4 text-sm font-bold ${
                          it.status === "완료" && it.issueTotal > 0
                            ? "text-red-500"
                            : "text-slate-400"
                        }`}
                      >
                        {it.status === "완료" ? it.issueTotal.toLocaleString() : "-"}
                      </td>

                      <td className="px-6 py-4">
                        {it.status === "완료" ? (
                          <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                            완료
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                            업로드 불가
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => onApply(it.id)}
                          disabled={it.status !== "완료"}
                          className={`rounded-lg px-4 py-1.5 text-sm font-bold transition-all ${
                            it.status === "완료"
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "cursor-not-allowed bg-slate-200 text-slate-400"
                          }`}
                        >
                          적용
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
            <p className="text-sm text-slate-500">
              총 <span className="font-bold text-slate-900">{items.length.toLocaleString()}</span>개 항목
            </p>

            <div className="flex gap-2">
              <button className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-400">
                ◀
              </button>
              <button className="h-10 w-10 rounded-xl bg-blue-600 font-bold text-white">
                1
              </button>
              <button className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-400">
                ▶
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}