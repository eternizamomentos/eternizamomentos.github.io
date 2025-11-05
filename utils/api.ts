// utils/api.ts
// Chama o Worker em produção usando ENV injetada no build (Actions).
// Fallback para a URL pública do Worker se a env faltar (ex.: preview local).

const API_URL =
  (typeof window !== "undefined" ? (window as any).__API_URL__ : undefined) ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://studioarthub-api.rapid-hill-dc23.workers.dev";

export async function createPixOrder(data: unknown) {
  const resp = await fetch(`${API_URL}/api/pagarme/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // use "live" em produção de verdade; "test" só simula no Worker
    body: JSON.stringify({ ...data, mode: "live" })
  });

  if (!resp.ok) {
    const txt = await resp.text().catch(() => "");
    throw new Error(`HTTP ${resp.status} - ${txt}`);
  }
  return resp.json();
}
