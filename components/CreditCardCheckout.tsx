// components/CreditCardCheckout.tsx
import { useState } from 'react';
import pagarme from 'pagarme';

export type CreditCardFormData = {
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
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
    setFormData((prev) => ({ ...prev, [name]: name === 'installments' ? parseInt(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // ⚠️ Tokenização segura — nunca envie dados brutos
      const client = await pagarme.client.connect({
        encryption_key: process.env.NEXT_PUBLIC_PAGARME_ENCRYPTION_KEY!,
      });

      const card = await client.security.encrypt({
        card_number: formData.cardNumber.replace(/\s/g, ''),
        card_holder_name: formData.cardHolderName,
        card_expiration_date: `${formData.expiryMonth}${formData.expiryYear}`,
        card_cvv: formData.cvv,
      });

      const card_token = card.card_hash;
      const cleanCpf = formData.cpf.replace(/\D/g, '');
      const cleanPhone = formData.phone.replace(/\D/g, '');
      const country_code = '55';
      const area_code = cleanPhone.slice(0, 2);
      const number = cleanPhone.slice(2);

      const payload = {
        card_token,
        cpf: cleanCpf,
        email: formData.email,
        amount: 1000, // R$10,00 em centavos
        installments: formData.installments,
        customer: {
          name: formData.cardHolderName,
          email: formData.email,
          type: 'individual',
          document: cleanCpf,
          document_type: 'CPF',
          phones: {
            mobile_phone: {
              country_code,
              area_code,
              number,
            },
          },
          address: {
            line_1: formData.addressLine1,
            line_2: formData.addressLine2,
            zip_code: formData.zipCode,
            city: formData.city,
            state: formData.state,
            country: 'BR',
          },
        },
      };

      const response = await fetch('https://studioarthub-api.rapid-hill-dc23.workers.dev/api/pagarme/credit-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        console.error('Erro:', data.error || data);
        setResult({ success: false, message: 'Pagamento recusado ou inválido. Verifique os dados.' });
      } else {
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
      }
    } catch (err) {
      console.error(err);
      setResult({ success: false, message: 'Erro inesperado. Tente novamente.' });
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
        className="w-full border border-gray-300 rounded px-4 py-2"
        maxLength={4}
        required
      />

      {/* Dados do comprador */}
      <input
        type="text"
        name="cpf"
        placeholder="CPF (somente números)"
        value={formData.cpf}
        onChange={handleChange}
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
        className="w-full border border-gray-300 rounded px-4 py-2"
        required
      />

      {/* Endereço */}
      <input
        type="text"
        name="zipCode"
        placeholder="CEP (somente números)"
        value={formData.zipCode}
        onChange={handleChange}
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
    </form>
  );
}
