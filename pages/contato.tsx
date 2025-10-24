import Layout from "../components/Layout";
import CTAButton from "../components/CTAButton";

export default function Contato() {
  return (
    <Layout>
      <main
        id="main"
        className="container-page py-20 text-center"
        style={{ fontFamily: '"Segoe UI", system-ui, sans-serif' }}
      >
        <h1
          className="text-3xl font-bold mb-6"
          style={{ color: "#101828" }}
        >
          Entre em Contato 🎵
        </h1>

        <p
          className="text-lg mb-8"
          style={{ color: "#667085" }}
        >
          Fale diretamente conosco pelo WhatsApp e encomende sua música personalizada:
        </p>

        {/* ✅ Botão padronizado Studio Art Hub */}
        <CTAButton
          href="https://wa.me/5596991451428?text=Oi!%20Quero%20criar%20uma%20m%C3%BAsica%20personalizada%20com%20voc%C3%AAs."
          label="Abrir conversa"
          target="_blank"
        />

        <p
          className="mt-10 text-sm opacity-80"
          style={{ color: "#667085" }}
        >
          WhatsApp de Negócios Oficial do Studio Art Hub · Atendimento de segunda a sábado, 9h às 18h.
        </p>
      </main>
    </Layout>
  );
}
