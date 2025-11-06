// components/CreditCardCheckout.tsx
import { useState } from 'react';

type CreditCardFormProps = {
  onSubmit?: (data: CreditCardFormData) => void;
  loading?: boolean;
};

export type CreditCardFormData = {
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cpf: string;
  email: string;
  installments: number;
};

export default function CreditCardCheckout({ onSubmit, loading = false }: CreditCardFormProps) {
  const [formData, setFormData] = useState<CreditCardFormData>({
    cardNumber: '',
    cardHolderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cpf: '',
    email: '',
    installments: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'installments' ? parseInt(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto bg-white shadow-md rounded-md p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800">Pagamento com Cartão</h2>

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
        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded transition"
      >
        {loading ? 'Processando...' : 'Pagar com Cartão'}
      </button>
    </form>
  );
}
