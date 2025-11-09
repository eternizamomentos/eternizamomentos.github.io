import dynamic from "next/dynamic";
const LogsPanel = dynamic(() => import("../components/LogsPanel"), { ssr: false });

export default function PainelLogsPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-4">
        🪵 Studio Art Hub — Painel de Logs
      </h1>
      <LogsPanel />
    </main>
  );
}
