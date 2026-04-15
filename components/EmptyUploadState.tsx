"use client";

type EmptyUploadStateProps = {
  onPickFile: () => void;
};

export default function EmptyUploadState({ onPickFile }: EmptyUploadStateProps) {
  return (
    <div className="bg-[#faf8ff] text-[#191b24] min-h-[calc(100vh-64px)] flex flex-col">
      {/* Functional Action Bar */}
      <section className="bg-[#f2f3ff] px-8 py-4 flex justify-between items-center border-b border-slate-200">
        <div className="flex items-center gap-3">
          <span className="text-blue-600 text-xl">☁️</span>
          <h2 className="font-bold text-lg">엑셀 보고서 업로드</h2>
        </div>

        <button
          onClick={onPickFile}
          className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-5 py-2 rounded-md font-medium flex items-center gap-2 shadow-sm hover:opacity-90 transition-all active:scale-95"
        >
          <span>＋</span>
          파일 선택
        </button>
      </section>

      {/* Empty State */}
      <section className="flex-grow flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="relative mb-10">
            <div className="absolute inset-0 bg-blue-500/5 rounded-full scale-150 blur-3xl opacity-50"></div>

            <div className="relative flex flex-col items-center justify-center">
              <div className="w-48 h-48 rounded-[2rem] bg-white flex items-center justify-center relative overflow-hidden border border-slate-200 shadow-sm">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-400/10 rounded-full blur-2xl"></div>

                <div className="z-10 bg-white/70 backdrop-blur-md p-6 rounded-full border border-white/20 shadow-lg">
                  <span className="text-[64px] text-blue-600">📄</span>
                </div>

                <div className="absolute top-8 left-8 w-3 h-3 bg-blue-400 rounded-full opacity-40"></div>
                <div className="absolute bottom-12 right-10 w-2 h-2 bg-indigo-400 rounded-full opacity-40"></div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-extrabold tracking-tight">파일을 업로드 해주세요</h1>
            <p className="text-slate-500 max-w-xs mx-auto leading-relaxed">
              분석을 시작하려면 시스템에서 내보낸 엑셀 데이터를 이 공간에 드래그하거나 버튼을 클릭하세요.
            </p>
          </div>

          <div className="mt-12 flex justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#f2f3ff] rounded-full">
              <span className="text-[18px] text-slate-500">📄</span>
              <span className="text-[12px] font-medium text-slate-500 tracking-wide">.XLSX, .CSV</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-[#f2f3ff] rounded-full">
              <span className="text-[18px] text-slate-500">🔒</span>
              <span className="text-[12px] font-medium text-slate-500 tracking-wide">SECURE ENCRYPTION</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Info Cards */}
      <section className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-blue-500/5 rounded-lg flex items-center justify-center mb-4">
            <span className="text-blue-600">📊</span>
          </div>
          <h3 className="font-bold text-lg mb-2">실시간 통계 분석</h3>
          <p className="text-sm text-slate-500">
            파일 업로드 즉시 AI가 콜 로그를 분석하여 콜 센터 운영 효율성을 시각화합니다.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-blue-500/5 rounded-lg flex items-center justify-center mb-4">
            <span className="text-blue-600">👥</span>
          </div>
          <h3 className="font-bold text-lg mb-2">상담원 성과 추적</h3>
          <p className="text-sm text-slate-500">
            상담원별 통화 품질 및 처리 속도를 비교하여 개선 포인트를 도출합니다.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-blue-500/5 rounded-lg flex items-center justify-center mb-4">
            <span className="text-blue-600">📈</span>
          </div>
          <h3 className="font-bold text-lg mb-2">예측 자동화</h3>
          <p className="text-sm text-slate-500">
            과거 데이터를 바탕으로 미래의 통화량을 예측하고 최적의 인력 배치를 제안합니다.
          </p>
        </div>
      </section>

      <footer className="mt-auto py-8 text-center text-slate-400 text-[12px] tracking-widest uppercase">
        Cognitive Command Terminal • System Status: Idle
      </footer>
    </div>
  );
}