// public/js/obs.js
// Observabilidade Frontend — Studio Art Hub (leve e sem dependências)

const API_URL = (window.NEXT_PUBLIC_API_URL || "https://studioarthub-api.rapid-hill-dc23.workers.dev").replace(/\/+$/,'');
const SESSION_ID = localStorage.getItem("sah_session") || (() => {
  const v = "sess_" + Math.random().toString(36).slice(2,10) + Date.now().toString(36);
  localStorage.setItem("sah_session", v);
  return v;
})();

function genId(prefix="id") {
  return `${prefix}_${Math.random().toString(36).slice(2,6)}${Date.now().toString(36)}`;
}

function newTraceId() { return genId("trc"); }
function newSpanId() { return genId("spn"); }

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

async function sendLog(event) {
  try {
    const res = await fetch(`${API_URL}/api/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify(event)
    });
    return res.ok;
  } catch { return false; }
}

// —— Hooks globais de erro (não bloqueiam UI)
window.addEventListener("error", (e) => {
  sendLog(baseLog({
    trace_id: newTraceId(),
    span_id: newSpanId(),
    route: location.pathname,
    stage: "frontend",
    status: "error",
    error: { class: "CLIENT", code: "E_WINDOW_ERROR", message: e.message || "window_error" },
    meta: { filename: e.filename, lineno: e.lineno, colno: e.colno }
  }));
});

window.addEventListener("unhandledrejection", (e) => {
  sendLog(baseLog({
    trace_id: newTraceId(),
    span_id: newSpanId(),
    route: location.pathname,
    stage: "frontend",
    status: "error",
    error: { class: "CLIENT", code: "E_UNHANDLED_PROMISE", message: String(e?.reason?.message || e?.reason || "unhandled_promise") }
  }));
});

// —— API pública para a página /preco
async function callPix(payload, traceIdSourceEl) {
  const trace_id = (traceIdSourceEl && traceIdSourceEl.dataset.traceId) || newTraceId();
  const t0 = performance.now();
  try {
    const res = await fetch(`${API_URL}/api/pagarme/create-order`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    const ok = res.ok;
    const latency = Math.round(performance.now() - t0);

    await sendLog(baseLog({
      trace_id, span_id: newSpanId(),
      route: "/api/pagarme/create-order",
      payment_method: "pix",
      stage: "frontend",
      status: ok ? "ok" : "error",
      http: { method: "POST", status: res.status, latency_ms: latency },
      error: ok ? null : { class: "GATEWAY", code: res.status >= 500 ? "E_GATEWAY_5XX" : "E_GATEWAY_4XX", message: "Pix request failed" },
      meta: { response_preview: text.slice(0, 600) }
    }));

    if (!ok) throw new Error(text);
    return JSON.parse(text);
  } catch (err) {
    await sendLog(baseLog({
      trace_id, span_id: newSpanId(),
      route: "/api/pagarme/create-order",
      payment_method: "pix",
      stage: "frontend",
      status: "error",
      error: { class: "NETWORK", code: "E_FETCH_FAILED", message: String(err?.message || err) }
    }));
    throw err;
  }
}

async function callCreditCard(payload, traceIdSourceEl) {
  const trace_id = (traceIdSourceEl && traceIdSourceEl.dataset.traceId) || newTraceId();
  const t0 = performance.now();
  try {
    const res = await fetch(`${API_URL}/api/pagarme/credit-card`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    const ok = res.ok;
    const latency = Math.round(performance.now() - t0);

    await sendLog(baseLog({
      trace_id, span_id: newSpanId(),
      route: "/api/pagarme/credit-card",
      payment_method: "credit_card",
      stage: "frontend",
      status: ok ? "ok" : "error",
      http: { method: "POST", status: res.status, latency_ms: latency },
      error: ok ? null : { class: "GATEWAY", code: res.status >= 500 ? "E_GATEWAY_5XX" : (res.status === 412 ? "E_CARD_VERIFICATION_FAILED" : "E_GATEWAY_4XX"), message: "Card request failed" },
      meta: { response_preview: text.slice(0, 600) }
    }));

    if (!ok) throw new Error(text);
    return JSON.parse(text);
  } catch (err) {
    await sendLog(baseLog({
      trace_id, span_id: newSpanId(),
      route: "/api/pagarme/credit-card",
      payment_method: "credit_card",
      stage: "frontend",
      status: "error",
      error: { class: "NETWORK", code: "E_FETCH_FAILED", message: String(err?.message || err) }
    }));
    throw err;
  }
}

function instrumentPaymentButtons({ pixBtn, cardBtn }) {
  if (pixBtn) {
    pixBtn.addEventListener("click", () => {
      const trace_id = newTraceId();
      pixBtn.dataset.traceId = trace_id;
      sendLog(baseLog({
        trace_id, span_id: newSpanId(),
        route: "/preco", stage: "frontend", status: "ok",
        payment_method: "pix", meta: { action: "click_generate_pix" }
      }));
    });
  }
  if (cardBtn) {
    cardBtn.addEventListener("click", () => {
      const trace_id = newTraceId();
      cardBtn.dataset.traceId = trace_id;
      sendLog(baseLog({
        trace_id, span_id: newSpanId(),
        route: "/preco", stage: "frontend", status: "ok",
        payment_method: "credit_card", meta: { action: "click_pay_card" }
      }));
    });
  }
}

// Expor no escopo global para uso fácil na página /preco
window.SAH_OBS = {
  instrumentPaymentButtons,
  callPix,
  callCreditCard
};
