"use client";

import React, { useEffect, useMemo, useState } from "react";

// Tipagem segura e compatível com ESLint/TS
interface LogEntry {
  timestamp: string;
  step: string;
  flow: string;
  status: string;
  message?: string | null;
  error?: string | Record<string, unknown> | null;
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
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const ENDPOINT =
    "https://studioarthub-api.rapid-hill-dc23.workers.dev/api/system/logs/full";

  async function fetchLogs(): Promise<void> {
    try {
      const res = await fetch(ENDPOINT, { cache: "no-store" });
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
      // Registra o horário de atualização no fuso horário de Brasília
      setLastUpdated(
        new Date().toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    }
  }

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  // ✅ Converte o timestamp UTC para Horário de Brasília corretamente
  function formatBRT(utcIso: string): string {
    try {
      const d = new Date(utcIso);
      return new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(d);
    } catch {
      return utcIso;
    }
  }

  // Função segura de compactação de erro
  function compactError(err: unknown): string {
    if (!err) return "-";
    if (typeof err === "string") return err;
    if (typeof err === "object") {
      try {
        return JSON.stringify(err);
      } catch {
        return "[Objeto não serializável]";
      }
    }
    return String(err);
  }

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      const matchEmail =
        !filterEmail || l.meta?.email?.toLowerCase().includes(filterEmail.toLowerCase());
      const matchStatus =
        !filterStatus || l.status.toLowerCase() === filterStatus.toLowerCase();
      return matchEmail && matchStatus;
    });
  }, [logs, filterEmail, filterStatus]);

  const sorted = useMemo(() => {
    return [...filtered].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [filtered]);

  const total = logs.length;
  const shown = sorted.length;

  function statusColor(status: string): string {
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
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          📊 Painel de Logs — Horário de Brasília (America/Sao_Paulo)
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
            />
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

      <div className="flex flex-wrap items-center gap-3 mb-2">
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
        <span className="ml-auto text-xs text-gray-400">
          Última atualização (BRT): {lastUpdated || "-"}
        </span>
      </div>

      {loading ? (
        <p className="text-gray-500">Carregando logs...</p>
      ) : sorted.length === 0 ? (
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
              {sorted.map((log, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border-b text-gray-600">
                    {formatBRT(log.timestamp)}
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
                    {compactError(log.error)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={() => {
            setFilterEmail("");
            setFilterStatus("");
            setRefreshKey((v) => v + 1);
          }}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm rounded-md"
        >
          Limpar filtros
        </button>
        <button
          onClick={() => setRefreshKey((v) => v + 1)}
          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-md"
        >
          Recarregar
        </button>
      </div>
    </div>
  );
}
