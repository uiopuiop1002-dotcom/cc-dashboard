"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";

export type UploadBarHandle = {
  openFilePicker: () => void;
};

type AgentResult = {
  name: string;
  role: string;
  issueCount: number;
  details?: string[];
};

type UploadBarProps = {
  onAnalyzed: (result: { rowCount: number; agents: AgentResult[] }) => void;
};

const UploadBar = forwardRef<UploadBarHandle, UploadBarProps>(function UploadBar(
  { onAnalyzed },
  ref
) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    openFilePicker: () => {
      fileRef.current?.click();
    },
  }));

  function onPickFile() {
    fileRef.current?.click();
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const form = new FormData();
    form.append("file", file);

    setLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error("analyze failed");
      }

      onAnalyzed({
        rowCount: data.rowCount,
        agents: data.agents,
      });
    } catch (error) {
      alert("분석 실패: 엑셀 컬럼명/파일 형식을 확인해줘");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-emerald-50 rounded-lg">📄</div>
        <div>
          <h2 className="font-bold text-slate-800">
            엑셀 보고서 업로드
            <span className="text-slate-300 font-normal mx-2">|</span>
            <span className="text-slate-400 font-normal text-sm">
              {fileName ? `선택됨: ${fileName}` : "선택된 파일 없음"}
            </span>
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-orange-500 bg-orange-50 px-3 py-1 rounded-full text-xs font-semibold">
          {loading ? "분석 중..." : "업로드 가능"}
        </span>

        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={onFileChange}
        />

        <button
          type="button"
          onClick={onPickFile}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {loading ? "분석 중..." : "파일 선택"}
        </button>
      </div>
    </section>
  );
});

export default UploadBar;