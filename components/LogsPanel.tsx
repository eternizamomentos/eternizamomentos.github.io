"use client";
import React, { useEffect, useState } from "react";

interface LogMeta {
  email?: string;
  amount?: number;
  order_id?: string;
  charge_id?: string;
  ip?: string;
  session_id?: string;
  [key: string]: string | number | undefined;
}

interface LogEntry {
  timestamp: string;
  step: string;
  flow: string;
  status: string;
  message?: string;
  error?: string;
  meta?: LogMeta;
}

export default function LogsPanel() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Endpoint da API Worker
  const LOGS_URL =
    "https://studioarthub-api.rapid-hill-dc23.workers.dev/api/system/logs/full";

  async function fetchLogs() {
    try {
      const res = await fetch(LOGS_URL);
      const data = await res.json();
      if (data.ok && Array.isArray(data.logs)) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error("Erro ao buscar logs:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000); // Atualiza a cada 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="text-gray-500">Carregando logs...</p>;

  return (
    <div className="bg-black text-green-300 p-4 rounded-lg font-mono text-sm max-h-[600px] overflow-y-auto">
      <h2 className="text-lg text-yellow-400 font-bold mb-2">
        🧾 Painel de Logs — Pix & Sistema
      </h2>

      {logs.length === 0 && (
        <p className="text-gray-400">Nenhum log encontrado ainda.</p>
      )}

      {logs.map((log, i) => (
        <div
          key={i}
          className="border-b border-green-800 py-1 hover:bg-green-900/20 transition-colors"
        >
          <div>
            <span className="text-yellow-400">[{log.flow}]</span>{" "}
            <span className="text-blue-400">{log.step}</span>{" "}
            <span className="text-red-400">{log.status}</span>{" "}
            <span className="text-gray-400">— {log.message || log.error}</span>
          </div>
          <div className="text-xs text-gray-500">
            {new Date(log.timestamp).toLocaleString("pt-BR")}
            {log.meta?.email && (
              <> • <span className="text-green-400">{log.meta.email}</span></>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
