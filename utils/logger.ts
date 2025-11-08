// utils/logger.ts
/* eslint-disable no-console */

type LogLevel = "info" | "warn" | "error";
type LogStatus = "ok" | "error" | "pending" | "done";
type LogStep =
  | "pix_click"
  | "pix_request_sent"
  | "pix_success"
  | "pix_error"
  | "pix_timeout"
  | "pix_copy"
  | "pix_view"
  | "pix_finish"
  | "exception";

export type FrontLog = {
  step: LogStep;
  level?: LogLevel;
  status?: LogStatus;
  flow?: "pix_checkout";
  message?: string;
  error?: string;
  meta?: Record<string, unknown>;
};

function getTraceId(): string {
  if (typeof window === "undefined") return "server";
  const key = "SAH_TRACE_ID";
  let id = window.sessionStorage.getItem(key);
  if (!id) {
    id = crypto.getRandomValues(new Uint32Array(1))[0].toString(16) + Date.now().toString(16);
    window.sessionStorage.setItem(key, id);
  }
  return id;
}

function getBaseUrl(): string {
  // GitHub Pages + Worker via env
  const base = (typeof process !== "undefined" && process.env && process.env.NEXT_PUBLIC_API_URL) || "";
  return base.replace(/\/+$/, "");
}

async function postWithRetry(url: string, body: unknown, attempts = 2): Promise<void> {
  let lastErr: unknown = null;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`log http ${res.status}`);
      return;
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 300 * (i + 1)));
    }
  }
  // falha silenciosa para não quebrar UX
  // ainda assim joga no console para debug manual quando necessário
  // eslint-disable-next-line no-console
  console.warn("⚠️ log send failed:", lastErr);
}

export async function logFrontend(event: FrontLog): Promise<void> {
  try {
    const api = getBaseUrl();
    if (!api) {
      console.warn("⚠️ NEXT_PUBLIC_API_URL não definido; log só no console.");
      console.log("📋 [LOG FRONT]", event);
      return;
    }

    const payload = {
      step: event.step,
      level: event.level || "info",
      status: event.status || "ok",
      flow: "pix_checkout",
      message: event.message,
      error: event.error,
      meta: {
        ...event.meta,
        page: typeof window !== "undefined" ? window.location.pathname : "/",
        href: typeof window !== "undefined" ? window.location.href : "",
        referrer: typeof document !== "undefined" ? document.referrer : "",
        ua: typeof navigator !== "undefined" ? navigator.userAgent : "",
        trace_id: getTraceId(),
      },
    };

    await postWithRetry(`${api}/api/log`, payload, 2);
  } catch {
    // nunca quebrar a UI por causa de log
  }
}
