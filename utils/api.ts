// utils/api.ts
const API_URL =
  (typeof window !== "undefined" ? (window as any).__API_URL__ : undefined) ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://studioarthub-api.rapid-hill-dc23.workers.dev";

interface PixOrderData {
  amount?: number;
  [key: string]: any;
}

export async function createPixOrder(data: PixOrderData) {
  const resp = await fetch(`${API_URL}/api/pagarme/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Em produção: mandar amount "real" (ou 500 centavos p/ teste)
    body: JSON.stringify({ ...data, mode: "live" })
  });
  if (!resp.ok) {
    const txt = await resp.text().catch(() => "");
    throw new Error(`HTTP ${resp.status} - ${txt}`);
  }
  return resp.json();
}
