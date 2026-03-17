"use client";

import Link from "next/link";



export default function UploadsPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* 상단바 */}
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
                            <Link href="/" className="text-slate-500 text-sm hover:text-blue-600">
                                대시보드
                            </Link>
                            <Link href="/uploads" className="text-blue-600 font-semibold text-sm">
                                업로드 이력
                            </Link>
                        </nav>
                    </div>

                    <div className="text-sm text-slate-500">업로드 이력</div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-7xl px-6 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-black">엑셀 데이터 업로드 이력</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        업로드된 파일의 처리 상태를 확인하세요.
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">No</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">업로드 일시</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">파일명</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">총 데이터</th>
                                    <th className="px-6 py-4 text-xs font-bold text-red-500 uppercase">실패</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">상태</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">적용</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                <tr className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-sm text-slate-500">124</td>
                                    <td className="px-6 py-4 text-sm font-medium">2023-11-20 14:30:12</td>
                                    <td className="px-6 py-4 text-sm font-semibold">October_Call_Log_Full.xlsx</td>
                                    <td className="px-6 py-4 text-sm">15,420</td>
                                    <td className="px-6 py-4 text-sm text-slate-400">0</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                                            완료
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-bold text-white hover:bg-blue-700">
                                            적용
                                        </button>
                                    </td>
                                </tr>

                                <tr className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-sm text-slate-500">123</td>
                                    <td className="px-6 py-4 text-sm font-medium">2023-11-20 11:15:45</td>
                                    <td className="px-6 py-4 text-sm font-semibold">User_Feedback_Survey.csv</td>
                                    <td className="px-6 py-4 text-sm">2,300</td>
                                    <td className="px-6 py-4 text-sm font-bold text-red-500">150</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                                            부분 실패
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-bold text-white hover:bg-blue-700">
                                            적용
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
                        <p className="text-sm text-slate-500">
                            총 <span className="font-bold text-slate-900">1,240</span>개 중{" "}
                            <span className="font-bold text-slate-900">1 - 10</span> 표시
                        </p>
                        <div className="flex gap-2">
                            <button className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-400 hover:bg-slate-100">
                                ◀
                            </button>
                            <button className="h-10 w-10 rounded-xl bg-blue-600 text-white font-bold">
                                1
                            </button>
                            <button className="h-10 w-10 rounded-xl border border-slate-200 bg-white font-medium hover:bg-slate-100">
                                2
                            </button>
                            <button className="h-10 w-10 rounded-xl border border-slate-200 bg-white font-medium hover:bg-slate-100">
                                ▶
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}