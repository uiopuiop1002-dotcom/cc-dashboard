"use client";

import { useState } from "react";
import Header from "@/components/Header";
import UploadBar from "@/components/UploadBar";
import AgentCard from "@/components/AgentCard";
import { addHistory, setActiveUploadId } from "@/lib/uploadStore";

type Agent = {
  name: string;
  role: string;
  issueCount: number;
  details?: string[];
};

const initialAgents: Agent[] = [];

export default function Page() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [rowCount, setRowCount] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      <Header search={search} setSearch={setSearch} />

      <main className="max-w-[1440px] mx-auto p-8 space-y-12">
        <UploadBar
          onAnalyzed={({ rowCount, agents }) => {
            setRowCount(rowCount);
            setAgents(agents);
          }}
        />

        {rowCount !== null && (
          <p className="text-sm text-slate-500">
            ✅ 분석 완료: 총 {rowCount.toLocaleString()}행
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAgents.map((agent, index) => (
            <AgentCard
  key={index}
  name={agent.name}
  role={agent.role}
  issueCount={agent.issueCount}
  details={agent.details}
/>
          ))}
        </div>
      </main>
    </div>
  );
}