"use client";

import Link from "next/link";

type HeaderProps = {
  search: string;
  setSearch: (value: string) => void;
};

export default function Header({ search, setSearch }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        {/* 로고 */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
            AI
          </div>
          <h1 className="font-bold text-lg">
            상담원 데이터 교정 대시보드
          </h1>
        </div>

        {/* 네비게이션 */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors"
          >
            대시보드
          </Link>

          <Link
            href="/uploads"
            className="text-slate-500 text-sm hover:text-blue-600 transition-colors"
          >
            업로드 이력
          </Link>

          <Link
            href="#"
            className="text-slate-500 text-sm hover:text-blue-600 transition-colors"
          >
            상담원 관리
          </Link>
        </nav>
      </div>

      {/* 검색창 */}
      <div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          placeholder="상담원 검색..."
          type="text"
        />
      </div>
    </header>
  );
}