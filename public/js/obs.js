// 🔧 Observabilidade Frontend – Studio Art Hub
// - Gera trace_id e span_id
// - Captura erros e eventos de pagamento
// - Envia logs para o Worker (/api/log)

const ORIGIN = location.origin;
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

function baseLog(partial) {
  return {
    ts: new Date().toISOString(),
    env: "production",
    origin: "web",
    client: {
      ua: navigator.userAgent,
      session_id: SESSION_ID,
      viewport: { w: window.innerWidth, h: window.innerHeight }
    },
    ...partial
  };
}

export async function sendLog(event) {
  try {
    const res = await fetch(`${API_URL}/api/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify(event)
    });
    // não bloquear UI; ok silencioso
    return res.ok;
  } catch {
    // queda silenciosa para não atrapalhar conversão
    return false;
  }
}

// —— Hooks globais de erro
window.addEventListener("error", (e) => {
  const evt = baseLog({
    trace_id: newTraceId(),
    span_id: newSpanId(),
    route: location.pathname,
    stage: "frontend",
    status: "error",
    error: {
      class: "CLIENT",
      code: "E_WINDOW_ERROR",
      message: e.message || "window_error"
    },
    meta: { filename: e.filename, lineno: e.lineno, colno: e.colno }
  });
  sendLog(evt);
});

window.addEventListener("unhandledrejection", (e) => {
  const evt = baseLog({
    trace_id: newTraceId(),
    span_id: newSpanId(),
    route: location.pathname,
    stage: "frontend",
    status: "error",
    error: {
      class: "CLIENT",
      code: "E_UNHANDLED_PROMISE",
      message: String(e.reason && e.reason.message || e.reason || "unhandled_promise")
    }
  });
  sendLog(evt);
});

// —— Helper para instrumentar botões
export function instrumentPaymentButtons({ pixBtn, cardBtn }) {
  if (pixBtn) {
    pixBtn.addEventListener("click", () => {
      const trace_id = newTraceId();
      sendLog(baseLog({
        trace_id, span_id: newSpanId(),
        route: "/preco", stage: "frontend", status: "ok",
        payment_method: "pix",
        meta: { action: "click_generate_pix" }
      }));
      pixBtn.dataset.traceId = trace_id;
    });
  }
  if (cardBtn) {
    cardBtn.addEventListener("click", () => {
      const trace_id = newTraceId();
      sendLog(baseLog({
        trace_id, span_id: newSpanId(),
        route: "/preco", stage: "frontend", status: "ok",
        payment_method: "credit_card",
        meta: { action: "click_pay_card" }
      }));
      cardBtn.dataset.traceId = trace_id;
    });
  }
}
