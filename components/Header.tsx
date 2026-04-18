"use client";

import Link from "next/link";

type HeaderProps = {
  search: string;
  setSearch: (value: string) => void;
};

export default function Header({ search, setSearch }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
      
      {/* 좌측 */}
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
            className="text-blue-600 font-semibold text-sm hover:text-blue-700"
          >
            대시보드
          </Link>

          <Link
            href="/uploads"
            className="text-slate-500 text-sm hover:text-blue-600"
          >
            업로드 이력
          </Link>

          <Link
            href="#"
            className="text-slate-500 text-sm hover:text-blue-600"
          >
            상담원 관리
          </Link>

          {/* 👇 여기 핵심 */}
          <a
            href="file://172.20.100.180/hunet/%EA%B5%90%EC%9C%A1%EC%84%9C%EB%B9%84%EC%8A%A4%EB%B3%B8%EB%B6%80/%EA%B3%A0%EA%B0%9D%ED%96%89%EB%B3%B5%ED%8C%80/04.%20%EB%8D%B0%EC%9D%B4%ED%84%B0%20%EB%B6%84%EC%84%9D%20%EB%B0%8F%20%EC%B7%A8%ED%95%A9/%ED%95%84%EB%93%9C%EC%95%A4%ED%8F%AC%EB%9F%BC/4%EC%9B%94/%ED%95%84%ED%8F%AC/%EA%B3%B5%EB%B0%B1%EC%A0%9C%EA%B1%B0(%EC%95%9E%EB%92%A4%EB%A7%8C).html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 text-sm hover:text-blue-600"
          >
            기업명
          </a>
        </nav>
      </div>

      {/* 우측 검색 */}
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