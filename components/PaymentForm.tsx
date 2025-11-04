"use client";
import { useState } from "react";

export default function PaymentForm() {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState<string | null>(null);

  async function handlePayment() {
    setLoading(true);
    try {
      const res = await fetch("/api/pagarme/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 49700, // valor em centavos
          name: "Música personalizada Studio Art Hub",
          email: "cliente@exemplo.com",
        }),
      });
      const data = await res.json();
      if (data.checkout_url) setLink(data.checkout_url);
    } catch (err) {
      console.error(err);
      alert("Erro ao iniciar pagamento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-center">
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-block mt-4"
        >
          Ir para o checkout seguro
        </a>
      ) : (
        <button
          onClick={handlePayment}
          disabled={loading}
          className="btn-primary px-8 py-3 bg-[#C7355D] text-white rounded-md hover:opacity-90 transition"
        >
          {loading ? "Carregando..." : "Gerar link de pagamento"}
        </button>
      )}
    </div>
  );
}
