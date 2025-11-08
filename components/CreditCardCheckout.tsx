import React, { useState } from 'react';

export type CreditCardFormData = {
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: string;  // "MM"
  expiryYear: string;   // "YY"
  cvv: string;

  cpf: string;
  email: string;
  phone: string;        // ex: "11999999999"

  zipCode: string;      // "00000000"
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;        // "SP"

  installments: number;
};

type ApiResponse = {
  ok: boolean;
  status?: string;       // 'paid' | 'pending' | 'failed' | ...
  message?: string;
  order_id?: string;
  charge_id?: string;
  error?: unknown;
};

type PagarmeTokenResponse =
  | { id?: string; token?: string; card?: { id?: string } }
  | Record<string, unknown>;

type PagarmeErrorItem = { message?: string } | Record<string, unknown>;
type PagarmeErrorShape =
  | { message?: string }
  | { error?: { message?: string } }
  | { errors?: PagarmeErrorItem[] }
  | Record<string, unknown>;

// ========== utils (sem any) ==========
function onlyDigits(v: string): string {
  return v.replace(/\D+/g, '');
}
function twoChars(v: string): string {
  return (v || '').trim().slice(0, 2);
}
function clamp2(value: string): string {
  return value.trim().slice(0, 2);
}
function luhnValid(card: string): boolean {
  const digits = onlyDigits(card);
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = digits.charCodeAt(i) - 48;
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}
function monthValid(mm: string): boolean {
  const n = Number(mm);
  return Number.isInteger(n) && n >= 1 && n <= 12;
}
function expiryNotPast(mm: string, yy: string): boolean {
  const m = Number(mm);
  const y = Number(yy);
  if (!Number.isInteger(m) || !Number.isInteger(y)) return false;
  if (!monthValid(mm)) return false;

  const fullYear = 2000 + y;
  const now = new Date();
  const curY = now.getFullYear();
  const curM = now.getMonth() + 1;

  if (fullYear < curY) return false;
  if (fullYear === curY && m < curM) return false;
  return true;
}

/** Extrai uma mensagem amigável de erro de formatos comuns retornados pela API v5 da Pagar.me */
function extractPagarmeMessage(data: unknown): string | null {
  if (typeof data !== 'object' || data === null) return null;
  const obj = data as PagarmeErrorShape;

  const rootMsg = (obj as { message?: unknown }).message;
  if (typeof rootMsg === 'string' && rootMsg.trim()) return rootMsg.trim();

  const errObj = (obj as { error?: unknown }).error;
  if (typeof errObj === 'object' && errObj !== null) {
    const msg = (errObj as { message?: unknown }).message;
    if (typeof msg === 'string' && msg.trim()) return msg.trim();
  }

  const errs = (obj as { errors?: unknown }).errors;
  if (Array.isArray(errs)) {
    for (const item of errs) {
      if (typeof item === 'object' && item !== null) {
        const m = (item as { message?: unknown }).message;
        if (typeof m === 'string' && m.trim()) return m.trim();
      }
    }
  }

  return null;
}

export default function CreditCardCheckout() {
  const [formData, setFormData] = useState<CreditCardFormData>({
    cardNumber: '',
    cardHolderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',

    cpf: '',
    email: '',
    phone: '',

    zipCode: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',

    installments: 1,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { success: boolean; message: string }>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'installments'
          ? parseInt(value, 10)
          : name === 'expiryMonth' || name === 'expiryYear'
          ? clamp2(value)
          : value,
    }));
  };

  // ======== Validação local antes da tokenização ========
  function validateBeforeToken(): string | null {
    if (!luhnValid(formData.cardNumber)) return 'Número do cartão inválido.';
    if (!monthValid(formData.expiryMonth)) return 'Mês de validade inválido (01‑12).';
    if (!expiryNotPast(formData.expiryMonth, formData.expiryYear)) return 'Cartão vencido.';
    if (!/^\d{3,4}$/.test(formData.cvv)) return 'CVV inválido.';

    const cleanCpf = onlyDigits(formData.cpf);
    if (!/^\d{11}$/.test(cleanCpf)) return 'CPF inválido (11 dígitos).';

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) return 'E‑mail inválido.';
    if (!/^\d{10,11}$/.test(onlyDigits(formData.phone))) return 'Telefone inválido (DDD + número).';
    if (!/^\d{8}$/.test(onlyDigits(formData.zipCode))) return 'CEP inválido (8 dígitos).';
    if (!formData.addressLine1.trim()) return 'Endereço obrigatório.';
    if (!formData.city.trim()) return 'Cidade obrigatória.';
    if (!/^[A-Za-z]{2}$/.test(formData.state.trim())) return 'UF inválida (ex: SP).';

    return null;
  }

  // ======== Tokenização — PCI‑safe ========
  async function tokenizeCardAndGetCardId(): Promise<string> {
    const publicKey = 'pk_npw0nlocMDsRPKBg'; // ✅ Chave pública de produção confirmada (PCI-safe)

    const number = onlyDigits(formData.cardNumber);
    const expMonth = twoChars(formData.expiryMonth);
    const expYearYY = twoChars(formData.expiryYear);
    const expYear = `20${expYearYY}`;

    const url = `https://api.pagar.me/core/v5/tokens?appId=${encodeURIComponent(publicKey)}`;

    const body = {
      type: 'card' as const,
      card: {
        number,
        holder_name: formData.cardHolderName,
        exp_month: expMonth,
        exp_year: expYear,
        cvv: formData.cvv,
      },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    if (!res.ok) {
      throw new Error(`Tokenização falhou (${res.status}): ${text}`);
    }

    const data: PagarmeTokenResponse = JSON.parse(text);

    // Obtém card_id
    const card_id = (data?.card as { id?: string })?.id;
    if (!card_id) {
      throw new Error('Não foi possível obter card_id a partir da tokenização.');
    }

    return card_id;
  }

  // ======== Chamada ao Worker (criação do pedido) ========
  async function sendToWorker(card_id: string): Promise<ApiResponse> {
    const cleanCpf = onlyDigits(formData.cpf);
    const cleanPhone = onlyDigits(formData.phone);
    const country_code = '55';
    const area_code = cleanPhone.slice(0, 2) || '00';
    const number = cleanPhone.slice(2) || '000000000';

    // Valor em centavos — ajuste conforme seu plano/preço
    const amount = 10000; // R$ 100,00 por exemplo

    const payload = {
      card_token: card_id, // ✅ compatível com o backend atualizado
      amount,
      installments: formData.installments,
      description: 'Música personalizada Studio Art Hub',
      item_code: 'MUSICA_PERSONALIZADA_001',
      customer: {
        name: formData.cardHolderName,
        email: formData.email,
        type: 'individual' as const,
        document: cleanCpf,
        document_type: 'CPF' as const,
        phones: {
          mobile_phone: { country_code, area_code, number },
        },
        address: {
          line_1: formData.addressLine1,
          line_2: formData.addressLine2,
          zip_code: onlyDigits(formData.zipCode),
          city: formData.city,
          state: formData.state.toUpperCase(),
          country: 'BR' as const,
        },
      },
    };

    const res = await fetch(
      'https://studioarthub-api.rapid-hill-dc23.workers.dev/api/pagarme/credit-card',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    let parsed: unknown;
    try {
      parsed = await res.json();
    } catch {
      parsed = { ok: false, message: 'Resposta inválida do servidor.' } as ApiResponse;
    }

    const data: ApiResponse = typeof parsed === 'object' && parsed !== null
      ? (parsed as ApiResponse)
      : { ok: false };

    if (!res.ok || !data.ok) {
      const friendly =
        extractPagarmeMessage(parsed) ??
        data.message ??
        `Falha ao processar pagamento (HTTP ${res.status}).`;
      return { ok: false, message: friendly, error: parsed };
    }

    return data;
  }

  // ======== Submit ========
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const localError = validateBeforeToken();
      if (localError) {
        setResult({ success: false, message: localError });
        return;
      }

      const card_id = await tokenizeCardAndGetCardId();
      const api = await sendToWorker(card_id);

      if (api.ok && api.status === 'paid') {
        setResult({ success: true, message: 'Pagamento aprovado com sucesso! 🎉' });
        setFormData({
          cardNumber: '',
          cardHolderName: '',
          expiryMonth: '',
          expiryYear: '',
          cvv: '',
          cpf: '',
          email: '',
          phone: '',
          zipCode: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          installments: 1,
        });
      } else {
        const readable =
          api.status === 'pending'
            ? 'Pagamento pendente de confirmação do emissor.'
            : api.message || 'Pagamento recusado ou não autorizado.';
        setResult({ success: false, message: readable });
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = typeof err === 'object' && err !== null && 'message' in err
        ? String((err as { message?: unknown }).message)
        : 'Erro inesperado. Tente novamente.';
      setResult({ success: false, message: msg });
    } finally {
      setLoading(false);
    }
  };

  // ======== UI ========
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-white shadow-md rounded-md p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Pagamento com Cartão</h2>

      <input
        type="text"
        name="cardNumber"
        placeholder="Número do Cartão"
        value={formData.cardNumber}
        onChange={handleChange}
        inputMode="numeric"
        className="w-full border border-gray-300 rounded px-4 py-2"
        maxLength={19}
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
          inputMode="numeric"
          className="w-1/2 border border-gray-300 rounded px-4 py-2"
          maxLength={2}
          required
        />
        <input
          type="text"
          name="expiryYear"
          placeholder="AA"
          value={formData.expiryYear}
          onChange={handleChange}
          inputMode="numeric"
          className="w-1/2 border border-gray-300 rounded px-4 py-2"
          maxLength={2}
          required
        />
      </div>

      <input
        type="text"
        name="cvv"
        placeholder="CVV"
        value={formData.cvv}
        onChange={handleChange}
        inputMode="numeric"
        className="w-full border border-gray-300 rounded px-4 py-2"
        maxLength={4}
        required
      />

      <input
        type="text"
        name="cpf"
        placeholder="CPF (somente números)"
        value={formData.cpf}
        onChange={handleChange}
        inputMode="numeric"
        className="w-full border border-gray-300 rounded px-4 py-2"
        maxLength={11}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="E‑mail"
        value={formData.email}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded px-4 py-2"
        required
      />

      <input
        type="text"
        name="phone"
        placeholder="Telefone com DDD (ex: 11999999999)"
        value={formData.phone}
        onChange={handleChange}
        inputMode="numeric"
        className="w-full border border-gray-300 rounded px-4 py-2"
        required
      />

      <input
        type="text"
        name="zipCode"
        placeholder="CEP (somente números)"
        value={formData.zipCode}
        onChange={handleChange}
        inputMode="numeric"
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
          className="w-1/3 border border-gray‑300 rounded px‑4 py‑2"
          maxLength={2}
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
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'
        } text-white font-semibold py-2 px-4 rounded transition`}
      >
        {loading ? 'Processando...' : 'Pagar com Cartão'}
      </button>

      {result && (
        <div
          className={`text-sm mt-4 px-4 py-2 rounded ${
            result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {result.message}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2">
        Dica: finalize o pagamento em até 1 minuto após inserir os dados do cartão. O token expira rapidamente.
      </p>
    </form>
  );
}
