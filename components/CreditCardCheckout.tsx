// components/CreditCardCheckout.tsx
// PRODUÇÃO / LIVE — Fluxo PCI-safe Pagar.me v5 (PSP):
// 1) Front tokeniza cartão em /core/v5/tokens?appId=pk_...
// 2) Envia card_token + customer/phone/address ao Worker /api/pagarme/credit-card
// 3) Worker cria customer/card/order (cartão)
// ⚠️ NÃO MEXER NO PIX.

import { useState } from "react";

export type CreditCardFormData = {
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: string; // "MM"
  expiryYear: string; // "YY"
  cvv: string;
  cpf: string;
  email: string;
  phone: string;
  zipCode: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  installments: number;
};

type ApiResponse = {
  ok: boolean;
  status?: string;
  message?: string;
  error?: unknown;
};

function onlyDigits(v: string) {
  return v.replace(/\D+/g, "");
}

function twoChars(v: string) {
  return (v || "").trim().slice(0, 2);
}

/** Extrai mensagem de erro útil da resposta da API Pagar.me */
function extractPagarmeMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as any;
  return (
    obj?.message ||
    obj?.error?.message ||
    obj?.errors?.[0]?.message ||
    null
  );
}

export default function CreditCardCheckout() {
  const [formData, setFormData] = useState<CreditCardFormData>({
    cardNumber: "",
    cardHolderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cpf: "",
    email: "",
    phone: "",
    zipCode: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    installments: 1,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "installments" ? parseInt(value) : value,
    }));
  };

  /** 1️⃣ Tokeniza cartão de forma PCI-safe usando a chave pública (Produção) */
  async function tokenizeCard(): Promise<{ id: string }> {
    const publicKey =
      process.env.NEXT_PUBLIC_PAGARME_PUBLIC_KEY ||
      "pk_npw0nlocMDsRPKBg"; // substitua pela sua chave pública real

    if (!publicKey || !publicKey.startsWith("pk_")) {
      throw new Error("Chave pública da Pagar.me ausente ou inválida.");
    }

    const number = onlyDigits(formData.cardNumber);
    const expMonth = parseInt(twoChars(formData.expiryMonth));
    const expYearYY = parseInt(twoChars(formData.expiryYear));
    const expYear = expYearYY < 100 ? 2000 + expYearYY : expYearYY;

    if (isNaN(expMonth) || expMonth < 1 || expMonth > 12) {
      throw new Error("Mês de validade inválido. Use formato MM/AA.");
    }

    const url = `https://api.pagar.me/core/v5/tokens?appId=${encodeURIComponent(publicKey)}`;

    const body = {
      type: "card",
      card: {
        number,
        holder_name: formData.cardHolderName.trim(),
        exp_month: expMonth,
        exp_year: expYear,
        cvv: formData.cvv,
      },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    if (!res.ok || !data?.id) {
      const friendly =
        extractPagarmeMessage(data) ||
        `Falha ao tokenizar cartão (HTTP ${res.status}).`;
      console.error("❌ [Tokenização] Erro:", data);
      throw new Error(friendly);
    }

    console.log("✅ [Tokenização] Token gerado:", data.id);
    return { id: data.id };
  }

  /** 2️⃣ Envia token e dados do comprador ao Worker PCI-safe */
  async function sendToWorker(card_token: string): Promise<ApiResponse> {
    const cleanCpf = onlyDigits(formData.cpf);
    const cleanPhone = onlyDigits(formData.phone);
    const country_code = "55";
    const area_code = cleanPhone.slice(0, 2) || "00";
    const number = cleanPhone.slice(2) || "000000000";

    const payload = {
      card_token,
      amount: 49700, // R$497,00 em centavos
      installments: formData.installments,
      description: "Música personalizada Studio Art Hub",
      item_code: "MUSICA_PERSONALIZADA_001",
      customer: {
        name: formData.cardHolderName,
        email: formData.email,
        type: "individual",
        document: cleanCpf,
        document_type: "CPF",
        phones: {
          mobile_phone: { country_code, area_code, number },
        },
        address: {
          line_1: formData.addressLine1,
          line_2: formData.addressLine2,
          zip_code: onlyDigits(formData.zipCode),
          city: formData.city,
          state: formData.state.toUpperCase(),
          country: "BR",
        },
      },
    };

    const res = await fetch(
      "https://studioarthub-api.rapid-hill-dc23.workers.dev/api/pagarme/credit-card",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.ok) {
      const friendly =
        extractPagarmeMessage(data) ||
        data?.message ||
        `Falha ao processar pagamento (HTTP ${res.status}).`;
      console.error("❌ [Worker] Erro:", data);
      return { ok: false, message: friendly, error: data };
    }

    console.log("✅ [Worker] Pagamento criado:", data);
    return data;
  }

  /** 3️⃣ Executa o fluxo completo */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const { id: card_token } = await tokenizeCard();
      const response = await sendToWorker(card_token);

      if (response.ok && response.status === "paid") {
        setResult({ success: true, message: "Pagamento aprovado! 🎉" });
        setFormData({
          cardNumber: "",
          cardHolderName: "",
          expiryMonth: "",
          expiryYear: "",
          cvv: "",
          cpf: "",
          email: "",
          phone: "",
          zipCode: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          installments: 1,
        });
      } else {
        setResult({
          success: false,
          message:
            response.message || "Pagamento recusado ou pendente de confirmação.",
        });
      }
    } catch (err: any) {
      console.error("❌ Erro:", err);
      setResult({
        success: false,
        message: err?.message || "Erro inesperado. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto bg-white shadow-md rounded-md p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        Pagamento com Cartão
      </h2>

      <input
        type="text"
        name="cardNumber"
        placeholder="Número do Cartão"
        value={formData.cardNumber}
        onChange={handleChange}
        inputMode="numeric"
        maxLength={19}
        className="w-full border border-gray-300 rounded px-4 py-2"
        required
      />

      <input
        type="text"
        name="cardHolderName"
        placeholder="Nome impresso no cartão"
        value={formData.cardHolderName}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded px-4 py-2"
        required
      />

      <div className="flex gap-4">
        <input
          type="text"
          name="expiryMonth"
          placeholder="MM"
          value={formData.expiryMonth}
          onChange={handleChange}
          maxLength={2}
          inputMode="numeric"
          className="w-1/2 border border-gray-300 rounded px-4 py-2"
          required
        />
        <input
          type="text"
          name="expiryYear"
          placeholder="AA"
          value={formData.expiryYear}
          onChange={handleChange}
          maxLength={2}
          inputMode="numeric"
          className="w-1/2 border border-gray-300 rounded px-4 py-2"
          required
        />
      </div>

      <input
        type="text"
        name="cvv"
        placeholder="CVV"
        value={formData.cvv}
        onChange={handleChange}
        maxLength={4}
        inputMode="numeric"
        className="w-full border border-gray-300 rounded px-4 py-2"
        required
      />

      <input
        type="text"
        name="cpf"
        placeholder="CPF (somente números)"
        value={formData.cpf}
        onChange={handleChange}
        inputMode="numeric"
        maxLength={11}
        className="w-full border border-gray-300 rounded px-4 py-2"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="E-mail"
        value={formData.email}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded px-4 py-2"
        required
      />

      <input
        type="text"
        name="phone"
        placeholder="Telefone (11999999999)"
        value={formData.phone}
        onChange={handleChange}
        inputMode="numeric"
        maxLength={11}
        className="w-full border border-gray-300 rounded px-4 py-2"
        required
      />

      <input
        type="text"
        name="zipCode"
        placeholder="CEP"
        value={formData.zipCode}
        onChange={handleChange}
        inputMode="numeric"
        maxLength={8}
        className="w-full border border-gray-300 rounded px-4 py-2"
        required
      />

      <input
        type="text"
        name="addressLine1"
        placeholder="Rua e número"
        value={formData.addressLine1}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded px-4 py-2"
        required
      />

      <input
        type="text"
        name="addressLine2"
        placeholder="Complemento (opcional)"
        value={formData.addressLine2}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded px-4 py-2"
      />

      <div className="flex gap-4">
        <input
          type="text"
          name="city"
          placeholder="Cidade"
          value={formData.city}
          onChange={handleChange}
          className="w-2/3 border border-gray-300 rounded px-4 py-2"
          required
        />
        <input
          type="text"
          name="state"
          placeholder="UF"
          value={formData.state}
          onChange={handleChange}
          maxLength={2}
          className="w-1/3 border border-gray-300 rounded px-4 py-2"
          required
        />
      </div>

      <select
        name="installments"
        value={formData.installments}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded px-4 py-2"
      >
        <option value={1}>1x sem juros</option>
        <option value={2}>2x sem juros</option>
        <option value={3}>3x sem juros</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className={`w-full ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-pink-600 hover:bg-pink-700"
        } text-white font-semibold py-2 px-4 rounded transition`}
      >
        {loading ? "Processando..." : "Pagar com Cartão"}
      </button>

      {result && (
        <div
          className={`text-sm mt-4 px-4 py-2 rounded ${
            result.success
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {result.message}
        </div>
      )}
    </form>
  );
}
