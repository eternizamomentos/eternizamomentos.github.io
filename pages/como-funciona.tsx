import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CTAButton from "../components/CTAButton";

export default function ComoFunciona() {
  return (
    <>
      <Head>
        <title>Como Funciona — Studio Art Hub</title>
        <meta
          name="description"
          content="Veja como transformar sua história em música de forma simples, emocional e com tecnologia humana + IA Donna Pro®."
        />
      </Head>

      <Header />

      <main className="bg-[#FFFBF7] text-[#0B1324]">
        {/* 1. Hero */}
        <section className="bg-gradient-to-br from-[#FFF6F9] to-[#F5E2E9] py-20 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-semibold text-[#101828] mb-6">
              Criar uma música personalizada é mais simples do que parece.
            </h1>
            <p className="text-lg md:text-xl text-[#667085] mb-8 leading-relaxed">
              A gente cuida de cada detalhe para transformar a sua história (ou de outra pessoa) em arte sonora — com emoção, sensibilidade e tecnologia criativa.
              <br />
              <strong className="text-[#101828]">
                Você vive. A gente transforma em música.
              </strong>
            </p>
            <CTAButton 
              href="https://docs.google.com/forms/d/e/1FAIpQLSeAD0LAytFFMwwMwj1WbKgutcJGoWKtNfr4j-z08vGT3TtX3w/viewform"
              label="Quero criar minha música" 
              target="_blank"
            />
          </div>
        </section>

        {/* 2. Etapas do Processo */}
        <section className="bg-[#FFFBF7] py-20 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 text-center">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className={`flex flex-col justify-start items-center px-4 pb-6 ${
                  n !== 4 ? "md:border-r border-[#E4D4DA]/60" : ""
                }`}
              >
                <div className="w-12 h-12 mb-4 rounded-full bg-[#E9B8C7] text-[#101828] font-bold flex items-center justify-center">
                  {n}
                </div>
                {n === 1 && (
                  <>
                    <h3 className="font-semibold mb-2 text-[#101828]">
                      Você compartilha a história
                    </h3>
                    <p className="text-[15px] leading-relaxed text-[#667085]">
                      Conte quem será homenageado, a ocasião e o sentimento que
                      quer transmitir. <br />
                      (O briefing é rápido e guiado — enviamos o link pelo
                      WhatsApp.)
                    </p>
                  </>
                )}
                {n === 2 && (
                  <>
                    <h3 className="font-semibold mb-2 text-[#101828]">
                      A gente compõe e produz
                    </h3>
                    <p className="text-[15px] leading-relaxed text-[#667085]">
                      Unimos habilidade humana + inteligência criativa e
                      musical <strong>Donna Pro®</strong> pra criar uma letra e
                      melodia únicas, com arranjo feito sob medida.
                    </p>
                  </>
                )}
                {n === 3 && (
                  <>
                    <h3 className="font-semibold mb-2 text-[#101828]">
                      Você aprova
                    </h3>
                    <p className="text-[15px] leading-relaxed text-[#667085]">
                      Enviamos a primeira versão. Você pode pedir até 2
                      revisões gratuitas para ajustar tom, letra, melodia etc.
                    </p>
                  </>
                )}
                {n === 4 && (
                  <>
                    <h3 className="font-semibold mb-2 text-[#101828]">
                      Entregamos sua música final
                    </h3>
                    <p className="text-[15px] leading-relaxed text-[#667085]">
                      Enviamos sua música em MP3 + capa personalizada, com
                      Prova de Criação e Registro no EDA.
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-[#667085] mt-12 max-w-xl mx-auto">
            Cada etapa é feita com o mesmo cuidado que você teve ao lembrar de
            suas memórias.
          </p>
        </section>

        {/* 3. O que torna nosso processo especial */}
        <section className="py-20 px-6 bg-[#FFFFFF] animate-fade-in">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
            {/* ✅ Imagem SVG atualizada */}
            <img
              src="/illustrations/ouvinte-emocionado.svg"
              alt="Pessoa emocionada ouvindo música"
              className="w-full md:w-1/2 max-w-sm mx-auto rounded-lg shadow-md transition-transform duration-300 hover:scale-[1.02]"
              loading="lazy"
            />

            <div className="md:w-1/2">
              <h2 className="text-2xl font-semibold text-[#101828] mb-4">
                Um processo guiado por emoção e tecnologia
              </h2>
              <p className="text-[#667085] leading-relaxed">
                Utiliza-se tecnologia de última geração da IA{" "}
                <strong>Donna Pro®</strong> e combinamos com inspiração humana
                sensível para representar os detalhes da história em questão —
                e <span className="text-[#C7355D] font-medium">
                  transformar isso em versos e melodias que realmente tocam o
                  coração.
                </span>
                <br />
                <br />
                🎧 O resultado: uma música exclusiva, emocionalmente autêntica,
                entregue com qualidade de estúdio e sensibilidade artesanal.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Depoimento */}
        <section className="bg-[#101828] text-white py-20 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="text-[#E7B75F] text-4xl mb-4">“</div>
            <p className="text-lg italic mb-4">
              Quando ouvi a música pela primeira vez, chorei.
              <br />
              Parecia que alguém tinha vivido minha história.
            </p>
            <p className="text-sm text-[#E7B75F] font-medium">
              — Carla, cliente do Studio Art Hub
            </p>
          </div>
        </section>

        {/* 5. Chamada Final */}
        <section className="bg-gradient-to-br from-[#FFF6F9] via-[#F5E2E9] to-[#E7B75F] text-[#101828] py-20 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              💛 Pronto pra transformar sua história em uma música inesquecível?
            </h2>
            <p className="text-lg mb-8 text-[#333]">
              Cada história é única — e a que você tem para contar merece ser
              eternizada através da música.
            </p>
            <CTAButton 
              href="https://wa.me/5596991451428?text=Oi!%20Quero%20criar%20uma%20m%C3%BAsica%20personalizada%20com%20voc%C3%AAs.%20%0A%C3%89%20pra%20uma%20ocasi%C3%A3o%20muito%20especial."
              label="Peça sua música agora 🎶"
              target="_blank"
            />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
