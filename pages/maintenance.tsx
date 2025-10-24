// /pages/maintenance.tsx
import CTAButton from "../components/CTAButton";

export default function MaintenancePage() {
  const year = new Date().getFullYear();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 text-center"
      style={{
        fontFamily: '"Segoe UI", system-ui, sans-serif',
        background: "#FFFBF7",
        color: "#0B1324",
      }}
    >
      <main className="max-w-xl py-12">
        <h1 className="text-3xl font-semibold text-[#101828] mb-4">
          🎵 Studio Art Hub
        </h1>

        <p className="text-[1.1rem] text-[#667085] mb-8 leading-relaxed">
          Estamos <strong>afinando os últimos instrumentos</strong> do nosso novo site.
          <br />
          Em breve, você poderá{" "}
          <em>transformar sua história em música</em> com nossa criação híbrida —{" "}
          humana + IA <strong>Donna Pro®</strong>.
        </p>

        {/* ✅ Botão CTA visual premium */}
        <CTAButton
          href="https://wa.me/5596991451428?text=Oi!%20Quero%20criar%20uma%20m%C3%BAsica%20personalizada%20com%20voc%C3%AAs.%20%0A%C3%89%20pra%20uma%20ocasi%C3%A3o%20muito%20especial."
          label="Fale conosco no WhatsApp"
          target="_blank"
        />

        <footer className="mt-8 text-sm text-[#667085]">
          © {year} Studio Art Hub · Todos os direitos reservados
        </footer>
      </main>
    </div>
  );
}
