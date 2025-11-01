// pages/contato.tsx
import Layout from "../components/Layout";
import CTAButton from "../components/CTAButton";

export default function Contato() {
  return (
    <Layout>
      <main
        id="main"
        className="container-page py-20 text-center flex flex-col items-center justify-center"
        style={{ fontFamily: '"Segoe UI", system-ui, sans-serif' }}
      >
        {/* HERO */}
        <section className="max-w-2xl">
          <h1
            className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-[#C7355D] to-[#E7B75F] bg-clip-text text-transparent"
          >
            Vamos criar sua música personalizada 🎙
          </h1>

          <p
            className="text-lg leading-relaxed mb-8"
            style={{ color: "#667085" }}
          >
            Cada canção é feita sob medida, com emoção real e curadoria artística.
            Fale conosco e conte sua história — ela pode virar uma melodia única.
          </p>

          {/* ✅ Botão padronizado Studio Art Hub */}
          <CTAButton
            href="https://wa.me/5596991451428?text=Oi!%20Quero%20criar%20uma%20m%C3%BAsica%20personalizada%20com%20o%20Studio%20Art%20Hub."
            label="Falar com o Studio Art Hub" Olá, gostaria de pedir minha música inédita 🎧
            target="_blank"
          />

          {/* Bloco alternativo — e-mail fallback */}
          <p
            className="mt-10 text-base opacity-90"
            style={{ color: "#667085" }}
          >
            Prefere escrever? Envie um e-mail para{" "}
            <a
              href="https://mail.google.com/mail/?view=cm&to=info@studioarthub.com&su=Solicitação%20de%20Informações&body=Olá,%20gostaria%20de%20pedir%20minha%20música%20inédita%20🎧"
              className="text-[#C7355D] font-medium hover:underline transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              info@studioarthub.com
            </a>
          </p>
        </section>

        {/* INFORMACIONAL */}
        <section className="mt-16 max-w-md">
          <div
            className="border-t border-[#E7E4DF] pt-6 text-base text-[#667085]"
          >
            WhatsApp de Negócios Oficial do Studio Art Hub ·{" "}
            <br className="hidden sm:block" />
            Atendimento de segunda a sábado, das 9h às 18h (horário de Brasília).
          </div>
        </section>
      </main>
    </Layout>
  );
}
