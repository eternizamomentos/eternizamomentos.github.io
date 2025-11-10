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
  const [online, setOnline] = useState(false);
  const [filterEmail, setFilterEmail] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const ENDPOINT =
    "https://studioarthub-api.rapid-hill-dc23.workers.dev/api/system/logs/full";

  async function fetchLogs() {
    try {
      const res = await fetch(ENDPOINT);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      if (data?.ok && Array.isArray(data.logs)) {
        setLogs(data.logs);
        setOnline(true);
      } else {
        setOnline(false);
      }
    } catch (err) {
      console.error("❌ Erro ao buscar logs:", err);
      setOnline(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  function localTime(utc: string) {
    try {
      const d = new Date(utc);
      const offsetMs = -3 * 60 * 60 * 1000; // UTC-3
      const local = new Date(d.getTime() + offsetMs);
      return local.toLocaleString("pt-BR");
    } catch {
      return utc;
    }
  }

  const filtered = logs.filter((l) => {
    const matchEmail = !filterEmail || l.meta?.email?.includes(filterEmail);
    const matchStatus =
      !filterStatus || l.status.toLowerCase() === filterStatus.toLowerCase();
    return matchEmail && matchStatus;
  });

  const total = logs.length;
  const shown = filtered.length;

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
    <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-6xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          📊 Painel de Logs PIX
        </h2>
        <div className="flex items-center gap-3">
          <span
            className={`flex items-center gap-1 text-sm font-medium ${
              online ? "text-green-600" : "text-red-600"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                online ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            {online ? "Conectado" : "Offline"}
          </span>
          <button
            onClick={() => {
              setLoading(true);
              fetchLogs();
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
          >
            Atualizar agora
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Filtrar por e-mail"
          className="border px-3 py-1 rounded-md text-sm"
          value={filterEmail}
          onChange={(e) => setFilterEmail(e.target.value)}
        />
        <select
          className="border px-2 py-1 rounded-md text-sm"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Todos os status</option>
          <option value="begin">🟡 Begin</option>
          <option value="done">🟢 Done</option>
          <option value="error">🔴 Error</option>
        </select>
        <span className="text-gray-500 text-sm">
          Mostrando {shown}/{total} registros
        </span>
      </div>

      {loading ? (
        <p className="text-gray-500">Carregando logs...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">Nenhum log encontrado.</p>
      ) : (
        <div className="overflow-x-auto max-h-[70vh] border rounded-md">
          <table className="min-w-full text-sm text-left text-gray-800">
            <thead className="sticky top-0 bg-gray-100 text-xs uppercase">
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
              {filtered
                .sort(
                  (a, b) =>
                    new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime()
                )
                .map((log, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border-b text-gray-600">
                      {localTime(log.timestamp)}
                    </td>
                    <td className="px-3 py-2 border-b">{log.step}</td>
                    <td
                      className={`px-3 py-2 border-b text-xs font-semibold rounded ${statusColor(
                        log.status
                      )}`}
                    >
                      {log.status}
                    </td>
                    <td className="px-3 py-2 border-b">
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
