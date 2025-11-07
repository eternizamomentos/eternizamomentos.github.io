// components/CreditCardCheckout.tsx
// Integração PCI-safe com Pagar.me v5 (PSP):
// 1) Front tokeniza o cartão via POST /core/v5/tokens?appId=<PUBLIC_KEY> (somente Content-Type).
// 2) Envia card_token + customer/address/phone ao Worker /api/pagarme/credit-card.
// 3) Worker cria o pedido em /core/v5/orders (sem tocar no PIX).

import { useState } from 'react';

export type CreditCardFormData = {
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: string; // "MM"
  expiryYear: string;  // "YY"
  cvv: string;

  cpf: string;
  email: string;
  phone: string;       // ex: "11999999999"

  zipCode: string;     // "00000000"
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;       // "SP"

  installments: number;
};

type ApiResult = { ok: boolean; message?: string };

function onlyDigits(v: string) {
  return v.replace(/\D+/g, '');
}

function twoChars(v: string) {
  return (v || '').trim().slice(0, 2);
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
      [name]: name === 'installments' ? parseInt(value) : value,
    }));
  };

  async function tokenizeCard(): Promise<{ id: string }> {
    // Doc oficial: /core/v5/tokens usa public_key via ?appId=...
    // Somente Content-Type, sem Authorization.  (ref: docs)
    const publicKey = process.env.NEXT_PUBLIC_PAGARME_PUBLIC_KEY;
    if (!publicKey) {
      throw new Error('Chave pública da Pagar.me ausente (NEXT_PUBLIC_PAGARME_PUBLIC_KEY).');
    }

    const number = onlyDigits(formData.cardNumber);
    const expMonth = twoChars(formData.expiryMonth);
    const expYearYY = twoChars(formData.expiryYear);
    const expYear = `20${expYearYY}`;

    const url = `https://api.pagar.me/core/v5/tokens?appId=${encodeURIComponent(publicKey)}`;

    // IMPORTANTE: billing address não é tokenizado; será enviado no /orders. (ref: docs)
    const body = {
      type: 'card',
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
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    if (!res.ok) {
      throw new Error(`Tokenização falhou (${res.status}): ${text}`);
    }

    // A resposta possui o token do cartão (temporário ~60s e single-use).
    const data = JSON.parse(text);
    // Em geral, o token vem em data.id ou data.token/id; normalizamos para "id".
    const tokenId = data?.id || data?.token || data?.card?.id || null;
    if (!tokenId) {
      throw new Error('Token de cartão não retornado pela API.');
    }
    return { id: tokenId };
  }

  async function sendToWorker(card_token: string): Promise<ApiResult> {
    // PSP exige customer completo (telefone e endereço) no pedido.
    const cleanCpf = onlyDigits(formData.cpf);
    const cleanPhone = onlyDigits(formData.phone);
    const country_code = '55';
    const area_code = cleanPhone.slice(0, 2) || '00';
    const number = cleanPhone.slice(2) || '000000000';

    // Valor de teste (R$ 10,00). Ajuste para 49700 quando for go-live.
    const amount = 1000;

    const payload = {
      // Importante para PSP: /orders deverá usar card_id; o Worker pode,
      // se necessário, converter card_token -> card_id criando o cartão na carteira.
      card_token,
      amount,
      installments: formData.installments,
      description: 'Música personalizada Studio Art Hub',
      item_code: 'MUSICA_PERSONALIZADA_001',

      customer: {
        name: formData.cardHolderName,
        email: formData.email,
        type: 'individual',
        document: cleanCpf,
        document_type: 'CPF',
        phones: {
          mobile_phone: { country_code, area_code, number },
        },
        address: {
          line_1: formData.addressLine1,
          line_2: formData.addressLine2,
          zip_code: onlyDigits(formData.zipCode),
          city: formData.city,
          state: formData.state.toUpperCase(),
          country: 'BR',
        },
      },
    };

    const res = await fetch(
      'https://studioarthub-api.rapid-hill-dc23.workers.dev/api/pagarme/credit-card',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Nota: o Worker usa Authorization Basic com secret_key no server (seguro).
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.ok) {
      const msg =
        data?.error?.message ||
        data?.error ||
        `Falha ao processar pagamento: HTTP ${res.status}`;
      return { ok: false, message: msg };
    }
    return { ok: true, message: 'Pagamento aprovado com sucesso! 🎉' };
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // 1) Tokenizar cartão via /tokens (public_key via appId)
      const { id: card_token } = await tokenizeCard();

      // 2) Enviar card_token + customer/address/phone ao Worker
      const api = await sendToWorker(card_token);

      if (!api.ok) {
        setResult({ success: false, message: api.message || 'Pagamento recusado/ inválido.' });
        return;
      }

      setResult({ success: true, message: api.message || 'Pagamento aprovado com sucesso! 🎉' });

      // Reset do formulário
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
    } catch (err: unknown) {
      console.error(err);
      // Observação: tokens expiram em ~60s; se o usuário demorar, pode falhar aqui.
      const msg = String(err?.message || err || 'Erro inesperado. Tente novamente.');
      setResult({ success: false, message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto bg-white shadow-md rounded-md p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800">Pagamento com Cartão</h2>

      {/* Dados do cartão */}
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

      {/* Dados do comprador (PSP exige customer completo) */}
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
        placeholder="E-mail"
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

      {/* Endereço (PSP exige) */}
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
          className="w-1/3 border border-gray-300 rounded px-4 py-2"
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
        className={`w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'} text-white font-semibold py-2 px-4 rounded transition`}
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

      {/* Dica de UX sobre token expirar */}
      <p className="text-xs text-gray-500 mt-2">
        Dica: finalize o pagamento em até 1 minuto após inserir os dados do cartão. O token expira rapidamente.
      </p>
    </form>
  );
}
