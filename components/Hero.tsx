export default function Hero() {
  return (
    <section
      className="text-white"
      style={{ background: "var(--gradient-night-gold)" }}
    >
      <div className="container-page py-16 md:py-24 text-center">
        <h1 className="font-bold mb-4 text-[clamp(2rem,4vw,3rem)]">
          “Não é só uma música. É a sua história, eternizada em som.”
        </h1>

        <p className="opacity-90 mb-8 text-[clamp(1.05rem,2vw,1.25rem)]">
          Músicas personalizadas que emocionam — criação humana + IA Donna Pro®.
        </p>

        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSeAD0LAytFFMwwMwj1WbKgutcJGoWKtNfr4j-z08vGT3TtX3w/viewform"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-block"
        >
          Peça sua música
        </a>

        <div className="mt-6 text-sm opacity-90">
          2 revisões • MP3 + capa personalizada • Registro no EDA
        </div>
      </div>
    </section>
  );
}
