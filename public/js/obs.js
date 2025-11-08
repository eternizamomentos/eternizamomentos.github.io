// public/js/obs.js
// Observabilidade base - Studio Art Hub

const API_URL = (window.NEXT_PUBLIC_API_URL || "https://studioarthub-api.rapid-hill-dc23.workers.dev").replace(/\/+$/,'');
const SESSION_ID = localStorage.getItem("sah_session") || (() => {
  const v = "sess_" + Math.random().toString(36).slice(2,10) + Date.now().toString(36);
  localStorage.setItem("sah_session", v);
  return v;
})();

function genId(prefix="id") {
  return `${prefix}_${Math.random().toString(36).slice(2,6)}${Date.now().toString(36)}`;
}

export function newTraceId() { return genId("trc"); }
export function newSpanId() { return genId("spn"); }

export async function sendLog(event) {
  try {
    await fetch(`${API_URL}/api/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        ts: new Date().toISOString(),
        env: "production",
        origin: "web",
        client: { ua: navigator.userAgent, session_id: SESSION_ID },
        ...event
      })
    });
  } catch (err) {
    console.warn("Log send failed:", err);
  }
}

// Captura erros globais automaticamente
window.addEventListener("error", (e) => {
  sendLog({
    route: location.pathname,
    stage: "frontend",
    status: "error",
    error: { code: "E_WINDOW_ERROR", message: e.message }
  });
});

window.addEventListener("unhandledrejection", (e) => {
  sendLog({
    route: location.pathname,
    stage: "frontend",
    status: "error",
    error: { code: "E_UNHANDLED_PROMISE", message: String(e.reason) }
  });
});

// expõe para uso nos componentes
window.SAH_OBS = { test: true };
