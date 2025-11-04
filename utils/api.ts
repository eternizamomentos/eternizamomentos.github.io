// utils/api.ts — versão live/test adaptável
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://studioarthub-api.rapid-hill-dc23.workers.dev";

export async function createPixOrder(data: any) {
  // ✅ detecta modo automaticamente: usa "live" se tiver chave configurada
  const mode = process.env.NEXT_PUBLIC_API_MODE || "live";

  const response = await fetch(`${API_URL}/api/pagarme/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data, mode }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Erro da API (${response.status}): ${errText}`);
  }

  const json = await response.json();
  return json;
}
