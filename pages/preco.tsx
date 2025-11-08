import Head from "next/head";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CTAButton from "../components/CTAButton";
import PixCheckout from "../components/PixCheckout";
import CreditCardCheckout from "../components/CreditCardCheckout";
import Script from "next/script";

export default function PrecoPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const faqItems = [
    {
      question: "Posso escolher o estilo musical?",
      answer: "Claro! Você define o estilo e os sentimentos principais.",
    },
    {
      question: "Quanto tempo demora pra receber?",
      answer: "Em média, 1 a 2 dias úteis.",
    },
    {
      question: "Posso pedir alterações?",
      answer: "Sim, até 2 revisões estão inclusas no pacote.",
    },
    {
      question: "Como é o pagamento?",
      answer: "Via Pix ou Cartão, com confirmação imediata após envio.",
    },
    {
      question: "A música é minha?",
      answer:
        "Você tem direito de uso pessoal e afetivo. A música é registrada para garantir segurança e você garante acesso a uma licença não-exclusiva padrão, mas outras licenças podem ser negociadas.",
    },
  ];

  return (
    <>
      <Head>
        <title>Preço | Studio Art Hub</title>
        <meta
          name="description"
          content="Descubra quanto custa transformar sua história em música personalizada e emocional."
        />
        <script src="/js/obs.js" defer></script>
      </Head>

      <Header />

      <main id="main" className="text-gray-800">

        {/* Hero emocional */}
        <section className="bg-gradient-to-b from-[#FFF6F9] to-[#F5E2E9] py-20 text-center px-4">
          <h1 className="text-2xl md:text-3xl font-semibold mb-4 text-rose-900">
            💛 Uma lembrança que vale mais do que o preço
          </h1>
          <p className="max-w-2xl mx-auto text-lg leading-relaxed mb-6">
            Quando você encomenda uma música personalizada, não está comprando um arquivo de áudio.
            Está eternizando uma história, um sentimento, uma memória.
          </p>
          <p className="max-w-2xl mx-auto text-lg leading-relaxed mb-8">
            É mais que uma música. É dizer aquilo que só palavras não conseguem expressar.
          </p>
          <CTAButton
            href="https://wa.me/5596991451428?text=Oi!%20Quero%20transformar%20minha%20hist%C3%B3ria%20em%20m%C3%BAsica%20personalizada."
            label="🎶 Quero transformar minha história em música"
            className="bg-cta text-white px-6 py-3 rounded font-semibold"
          />
        </section>

        {/* Valor percebido */}
        <section className="bg-white py-20 px-4">
          <h2 className="text-center text-xl md:text-2xl font-semibold mb-12">
            O que está incluído no Pacote Único
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-gray-700 text-base">
            <ul className="space-y-4">
              <li>💬 <strong>Briefing personalizado:</strong> escutamos sua história, ocasião e emoções.</li>
              <li>✍️ <strong>Composição original:</strong> letra e melodia criadas do zero.</li>
              <li>🎛️ <strong>Produção profissional:</strong> arranjo, mix e master de estúdio.</li>
              <li>🎨 <strong>Capa exclusiva:</strong> arte visual feita sob medida e assinada.</li>
            </ul>
            <ul className="space-y-4">
              <li>🔁 <strong>Duas revisões gratuitas:</strong> ajuste de tom, letra ou mix.</li>
              <li>📜 <strong>Prova de criação + registro:</strong> garantia de autoria e segurança.</li>
              <li>📦 <strong>Entrega digital:</strong> arquivo MP3 final em alta qualidade.</li>
            </ul>
          </div>
          <p className="text-center text-lg font-medium mt-10 italic text-rose-800">
            Você paga uma vez. A emoção dura para sempre.
          </p>
        </section>

        {/* Preço */}
        <section className="bg-[#101828] text-[#E7B75F] py-20 text-center px-4">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Seu investimento:</h2>
          <p className="text-3xl md:text-4xl font-bold mb-4">💰 R$ 497,00</p>
          <p className="mb-6 text-lg">Pagamento único • Pix ou Cartão</p>

          <ul className="mb-6 text-base text-[#F7EAC0] space-y-1">
            <li>✅ 2 revisões inclusas</li>
            <li>✅ Entrega digital com capa</li>
            <li>✅ Registro de criação incluído</li>
            <li>✅ Entregue em 1 ou 2 dias úteis</li>
          </ul>

          <p className="italic text-base mb-6">💬 “Parece caro... até você ouvir sua história transformada em música.”</p>

          <CTAButton
            href="https://wa.me/5596991451428?text=Quero%20pedir%20minha%20m%C3%BAsica%20personalizada%20agora!"
            label="👉 Peça sua música agora"
            className="bg-cta text-white px-6 py-3 rounded font-semibold"
          />
        </section>

        {/* Prova social */}
        <section className="bg-[#E9B8C7]/10 py-16 px-4 text-center">
          <blockquote className="text-xl italic max-w-2xl mx-auto mb-4">
            “Quando ouvi, chorei. Foi como reviver um momento que pensei que nunca mais voltaria.”
          </blockquote>
          <p className="text-base mb-6">— Carla, cliente Studio Art Hub</p>
          <div className="text-base text-gray-700 space-x-4">
            <span>🔒 Pagamento seguro</span>
            <span>🎧 Entrega garantida</span>
            <span>💬 Atendimento humano</span>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-20 px-4 max-w-3xl mx-auto">
          <h2 className="text-center text-xl md:text-2xl font-semibold mb-10">
            Antes de pedir sua música…
          </h2>
          <div className="space-y-4 text-base">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded">
                <button
                  className="w-full text-left px-4 py-3 font-medium text-gray-800 flex justify-between items-center"
                  onClick={() => toggleFAQ(index)}
                >
                  {item.question}
                  <span>{faqOpen === index ? "−" : "+"}</span>
                </button>
                {faqOpen === index && (
                  <div className="px-4 pb-4 text-gray-600">{item.answer}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Fechamento emocional */}
        <section className="bg-gradient-to-br from-[#101828] to-[#3A2A55] text-white py-20 text-center px-4">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">🌟 Dê vida à sua história.</h2>
          <p className="max-w-xl mx-auto mb-6 text-lg leading-relaxed">
            Imagine alguém ouvindo a própria história em forma de música...
            É isso que você está prestes a fazer.
          </p>
          <p className="mb-10 text-base italic">💛 Uma lembrança eterna começa com um clique.</p>
          <CTAButton
            href="https://wa.me/5596991451428?text=Quero%20minha%20m%C3%BAsica%20personalizada%20agora"
            label="🎶 Peça sua música agora"
            className="bg-cta text-white px-6 py-3 rounded font-semibold"
          />
        </section>

        {/* Checkout Pix */}
        <section id="checkout" className="py-20 bg-[#FFF6F9]">
          <h3 className="text-center text-xl font-semibold mb-10 text-rose-900">Pagamento via Pix</h3>
          <PixCheckout />
        </section>

        {/* Checkout Cartão de Crédito */}
        <section id="checkout-card" className="py-20 bg-[#FFFBF7]">
          <h3 className="text-center text-xl font-semibold mb-10 text-rose-900">Pagamento via Cartão de Crédito</h3>
          <CreditCardCheckout />
        </section>
        
      </main>
      
      <Footer />
      
    </>
  );
}
