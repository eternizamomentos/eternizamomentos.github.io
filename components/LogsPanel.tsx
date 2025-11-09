"use client";

import React, { useEffect, useState } from "react";

interface LogEntry {
  timestamp: string;
  step: string;
  flow: string;
  status: string;
  message?: string | null;
  error?: string | null;
  meta?: {
    email?: string | null;
    amount?: number | null;
    order_id?: string | null;
    charge_id?: string | null;
    ip?: string | null;
  };
}

export default function LogsPanel() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchLogs() {
    try {
      const res = await fetch(
        "https://studioarthub-api.rapid-hill-dc23.workers.dev/api/system/logs/full"
      );
      const data = await res.json();
      if (data?.ok && Array.isArray(data.logs)) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error("❌ Erro ao buscar logs:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  function localTime(utc: string) {
    try {
      const d = new Date(utc);
      const offsetMs = -3 * 60 * 60 * 1000; // UTC-3 (Brasília)
      const local = new Date(d.getTime() + offsetMs);
      return local.toLocaleString("pt-BR");
    } catch {
      return utc;
    }
  }

  function statusColor(status: string) {
    switch (status) {
      case "done":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "begin":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-900">
        📊 Painel de Logs PIX — Studio Art Hub
      </h2>

      {loading ? (
        <p className="text-gray-500">Carregando logs...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-500">Nenhum log disponível.</p>
      ) : (
        <div className="overflow-x-auto max-h-[70vh]">
          <table className="min-w-full text-sm text-left text-gray-800 border">
            <thead className="sticky top-0 bg-gray-50">
              <tr>
                <th className="px-3 py-2 border-b">Horário (Brasília)</th>
                <th className="px-3 py-2 border-b">Etapa</th>
                <th className="px-3 py-2 border-b">Status</th>
                <th className="px-3 py-2 border-b">Email</th>
                <th className="px-3 py-2 border-b">Mensagem</th>
                <th className="px-3 py-2 border-b">Erro</th>
              </tr>
            </thead>
            <tbody>
              {logs
                .sort(
                  (a, b) =>
                    new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime()
                )
                .map((log, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border-b text-gray-600">
                      {localTime(log.timestamp)}
                    </td>
                    <td className="px-3 py-2 border-b font-medium">
                      {log.step}
                    </td>
                    <td
                      className={`px-3 py-2 border-b text-xs font-semibold rounded ${statusColor(
                        log.status
                      )}`}
                    >
                      {log.status}
                    </td>
                    <td className="px-3 py-2 border-b text-gray-600">
                      {log.meta?.email || "-"}
                    </td>
                    <td className="px-3 py-2 border-b">
                      {log.message || "-"}
                    </td>
                    <td className="px-3 py-2 border-b text-red-500 text-xs max-w-xs overflow-hidden truncate">
                      {log.error
                        ? log.error.substring(0, 120) + "..."
                        : "-"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
