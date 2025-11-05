// utils/api.ts
// Conexão do frontend com o Worker (Pix Pagar.me via API)

type PixOrderPayload = Record<string, any>;

const API_URL =
  (typeof window !== "undefined" ? (window as any).__API_URL__ : undefined) ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://studioarthub-api.rapid-hill-dc23.workers.dev";

export async function createPixOrder(data: PixOrderPayload = {}) {
  const payload = { ...data, mode: "live" };

  const resp = await fetch(`${API_URL}/api/pagarme/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!resp.ok) {
    const txt = await resp.text().catch(() => "");
    throw new Error(`HTTP ${resp.status} - ${txt}`);
  }

  return resp.json();
}
