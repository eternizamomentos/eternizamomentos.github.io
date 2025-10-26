import AudioPlayer from "./AudioPlayer";
import CTAButton from "./CTAButton";

export default function FeaturedSamples() {
  // 🎵 Lista de amostras (reais + exemplos)
  const samples = [
    {
      title: "Além das Estrelas",
      sources: [
        { src: "/samples/alem-das-estrelas-demo.m4a", type: "audio/mp4" },
        // { src: "/samples/alem-das-estrelas.mp3", type: "audio/mpeg" }, // descomente se gerar o mp3 futuramente
      ],
      cover: "/covers/alem-das-estrelas.webp",
      caption:
        "Uma canção sobre expectativa, dedicação e coragem diante do desconhecido — escrita antes do resultado de uma prova decisiva, olhando além, com esperança.",
      metaNote: "ChatGPT Image 26 de out. de 2025, 15_26_21",
    },
    {
      title: "Homenagem para os Pais",
      src: "/samples/homenagem-pais.mp3",
      cover: "/covers/homenagem-pais.jpg",
      caption: "Emoção e gratidão transformadas em canção",
    },
    {
      title: "Canção para Casamento",
      src: "/samples/casamento.mp3",
      cover: "/covers/casamento.jpg",
      caption: "Uma trilha única para um momento único",
    },
    {
      title: "Tributo In Memoriam",
      src: "/samples/tributo.mp3",
      cover: "/covers/tributo.jpg",
      caption: "Saudade, amor e memória em forma de música",
    },
  ];

  return (
    <section className="py-16 px-6 bg-[#FFFBF7]" aria-labelledby="amostras-titulo">
      <div className="container-page">
        {/* Título da seção */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 id="amostras-titulo" className="text-2xl md:text-3xl font-semibold text-[#101828]">
            Portfólio de Amostras
          </h2>
          <p className="mt-3 text-[#667085]">
            Ouça trechos de músicas que já emocionaram famílias, casais e homenagens especiais.
          </p>
        </div>

        {/* Grade de players */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {samples.map((s) => (
            <AudioPlayer
              key={s.title}
              title={s.title}
              caption={s.caption}
              coverSrc={s.cover}
              src={s.src}
              sources={s.sources}
              metaNote={s.metaNote}
            />
          ))}
        </div>

        {/* CTA final */}
        <div className="mt-10 text-center">
          <CTAButton
            href="https://docs.google.com/forms/d/e/1FAIpQLSeAD0LAytFFMwwMwj1WbKgutcJGoWKtNfr4j-z08vGT3TtX3w/viewform"
            label="Quero uma música assim pra mim"
            target="_blank"
          />
        </div>
      </div>
    </section>
  );
}
