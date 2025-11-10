"use client";

import React, { useEffect, useMemo, useState } from "react";

// ===== Tipagens Estritas =====
interface LogMeta {
  email?: string | null;
  amount?: number | null;
  order_id?: string | null;
  charge_id?: string | null;
  ip?: string | null;
  env?: string | null;
  endpoint?: string | null;
  latency_ms?: number | null;
  suggestion?: string | null;
}

interface LogError {
  message?: string;
  errors?: Record<string, unknown>;
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  step: string;
  flow: string;
  status: string;
  message?: string | null;
  error?: string | LogError | null;
  meta?: LogMeta;
}

// ===== Componente =====
export default function LogsPanel() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(false);
  const [filterEmail, setFilterEmail] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const ENDPOINT =
    "https://studioarthub-api.rapid-hill-dc23.workers.dev/api/system/logs/full";

  // ===== Fetch Logs =====
  async function fetchLogs(): Promise<void> {
    try {
      const res = await fetch(ENDPOINT, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
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

  // ===== Helpers =====
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

  function extractErrorMessage(error: string | LogError | null | undefined): string {
    if (!error) return "-";
    if (typeof error === "string") {
      try {
        const parsed = JSON.parse(error) as LogError;
        return parsed.message || error;
      } catch {
        return error;
      }
    }
    if (typeof error === "object") {
      return error.message ?? "-";
    }
    return "-";
  }

  function extractErrorDetails(error: string | LogError | null | undefined): string {
    if (!error) return "";
    if (typeof error === "string") {
      try {
        const parsed = JSON.parse(error) as LogError;
        if (parsed.errors) {
          const entries = Object.entries(parsed.errors).map(
            ([field, msgs]) => `${field} → ${(msgs as string[]).join(", ")}`
          );
          return entries.join("; ");
        }
      } catch {
        return "";
      }
    } else if (typeof error === "object" && error.errors) {
      const entries = Object.entries(error.errors).map(
        ([field, msgs]) => `${field} → ${(msgs as string[]).join(", ")}`
      );
      return entries.join("; ");
    }
    return "";
  }

  function copyToClipboard(text: string): void {
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function copyLogReadable(log: LogEntry): void {
    const errMsg = extractErrorMessage(log.error);
    const errDetail = extractErrorDetails(log.error);
    const readable = [
      `🕒 ${formatBRT(log.timestamp)} (Horário Brasília)`,
      `📍 step: ${log.step}`,
      `⚙️ status: ${log.status}`,
      `💬 ${log.message || "-"}`,
      `❗ cause: ${errMsg}`,
      errDetail ? `🔍 detail: ${errDetail}` : "",
      log.meta?.endpoint ? `🌐 endpoint: ${log.meta.endpoint}` : "",
      log.meta?.latency_ms ? `⏱️ latency: ${log.meta.latency_ms}ms` : "",
      log.meta?.env ? `📦 env: ${log.meta.env}` : "",
      log.meta?.email ? `👤 user: ${log.meta.email}` : "",
      log.meta?.amount ? `💰 amount: R$${(log.meta.amount / 100).toFixed(2)}` : "",
      log.meta?.order_id ? `💾 order_id: ${log.meta.order_id}` : "",
      log.meta?.charge_id ? `💾 charge_id: ${log.meta.charge_id}` : "",
      log.meta?.ip ? `🌐 ip: ${log.meta.ip}` : "",
      log.meta?.suggestion ? `💡 action: ${log.meta.suggestion}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    copyToClipboard(readable);
  }

  // ===== Filtering & Sorting =====
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

  // ===== Render =====
  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-6xl relative">
      {copied && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-3 py-2 rounded-md shadow z-50 animate-fadeIn">
          Copiado!
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          📊 Painel de Logs — Studio Art Hub
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
                <th className="px-3 py-2 border-b">Horário</th>
                <th className="px-3 py-2 border-b">Etapa</th>
                <th className="px-3 py-2 border-b">Status</th>
                <th className="px-3 py-2 border-b">Email</th>
                <th className="px-3 py-2 border-b">Mensagem</th>
                <th className="px-3 py-2 border-b">Erro / Causa</th>
                <th className="px-3 py-2 border-b">Diagnóstico</th>
                <th className="px-3 py-2 border-b text-center">Copiar</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((log, i) => (
                <tr
                  key={i}
                  onClick={() => setSelectedLog(log)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
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
                  <td className="px-3 py-2 border-b">{log.message || "-"}</td>
                  <td className="px-3 py-2 border-b text-red-500 text-xs max-w-xs truncate">
                    {extractErrorMessage(log.error)}
                  </td>
                  <td className="px-3 py-2 border-b text-xs text-gray-700">
                    {log.meta?.env || "-"} / {log.meta?.latency_ms || 0}ms
                  </td>
                  <td className="px-3 py-2 border-b text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyLogReadable(log);
                      }}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Copiar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Detalhado */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-lg">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              🧾 Detalhes do Log
            </h3>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto whitespace-pre-wrap text-gray-700">
              {JSON.stringify(selectedLog, null, 2)}
            </pre>
            {selectedLog.meta?.suggestion && (
              <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 text-sm text-yellow-800 rounded">
                💡 <strong>Ação sugerida:</strong> {selectedLog.meta.suggestion}
              </div>
            )}
            <div className="mt-4 text-right">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-6 text-center text-xs text-gray-400">
        Studio Art Hub — Painel de Logs v2.5 Diagnóstico de Pagamentos
      </footer>
    </div>
  );
}
