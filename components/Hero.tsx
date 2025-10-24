import CTAButton from "../components/CTAButton"; // ✅ import correto no topo

export default function Hero() {
  return (
    <section
  className="text-white text-center"
  style={{
    background: "var(--gradient-night-gold)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    marginTop: 0, // ✅ remove gap residual
    paddingTop: "4rem",
    paddingBottom: "6rem",
  }}
  aria-label="Seção principal: proposta de valor"
>
      <div className="container-page">
        <h1 className="font-bold mb-4 text-[clamp(2rem,4vw,3rem)] leading-tight">
          “Não é só uma música. É a sua história, eternizada em som.”
        </h1>

        <p className="opacity-90 mb-8 text-[clamp(1.05rem,2vw,1.25rem)] max-w-2xl mx-auto">
          Músicas personalizadas que emocionam — criação humana + IA{" "}
          <strong>Donna Pro®</strong>.
        </p>

        {/* ✅ Botão CTA padronizado */}
        <CTAButton
          href="https://docs.google.com/forms/d/e/1FAIpQLSeAD0LAytFFMwwMwj1WbKgutcJGoWKtNfr4j-z08vGT3TtX3w/viewform"
          label="Peça sua música"
          target="_blank"
        />

        <div className="mt-6 text-sm opacity-90">
          2 revisões • MP3 + capa personalizada • Registro no EDA
        </div>
      </div>
    </section>
  );
}
