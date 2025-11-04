import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { amount, name, email } = req.body;

  try {
    const response = await fetch("https://api.pagar.me/core/v5/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(process.env.PAGARME_API_KEY + ":").toString("base64")}`,
      },
      body: JSON.stringify({
        items: [{ amount, quantity: 1, description: name }],
        customer: { name, email },
        payments: [{ payment_method: "pix" }], // Pix como exemplo
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar pedido" });
  }
}
