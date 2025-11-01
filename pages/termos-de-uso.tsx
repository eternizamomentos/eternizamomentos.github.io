import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TermosDeUsoPage() {
  const updatedAt = "01/11/2025"; // Atualize sempre que editar o texto

  return (
    <>
      <Head>
        <title>Termos de Uso | Studio Art Hub</title>
        <meta
          name="description"
          content="Leia os Termos de Uso do Studio Art Hub — criação de músicas personalizadas com curadoria humana e suporte de IA criativa, em conformidade com a legislação brasileira."
        />
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <Header />

      <main id="main" className="bg-[#FFFBF7] text-[#0B1324]">
        <section className="container-page px-4 py-16">
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-semibold mb-3">
              Termos de Uso
            </h1>
            <p className="text-base text-gray-600">
              Última atualização: {updatedAt}
            </p>
          </header>

          <article className="prose prose-neutral max-w-none">
            {/* Identificação */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-3">1. Quem somos</h2>
              <p className="text-base leading-relaxed">
                O <strong>Studio Art Hub</strong> é um estúdio independente
                especializado em criar <strong>músicas personalizadas</strong>,
                que transformam histórias e sentimentos em arte sonora.
                <br />
                Operamos sob o formato <strong>MEI</strong>, sob CNPJ{" "}
                <strong>55.028.904/0001-17</strong>, sediado em Macapá-AP.
                <br />
                Contato oficial:{" "}
                <a
                  href="https://mail.google.com/mail/?view=cm&to=info@studioarthub.com&su=Solicitação%20de%20Informações&body=Olá,%20gostaria%20de%20saber%20mais%20sobre%20seus%20Termos%20de%20Uso."
                  className="text-[#C7355D] font-medium hover:underline transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  info@studioarthub.com
                </a>{" "}
                |{" "}
                <a
                  href="https://www.studioarthub.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C7355D] font-medium hover:underline transition-colors duration-200"
                >
                  www.studioarthub.com
                </a>
              </p>
            </section>

            {/* Objeto */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-3">2. Objeto</h2>
              <p className="text-base leading-relaxed">
                Estes Termos de Uso regulam o acesso e utilização dos serviços
                prestados pelo Studio Art Hub, incluindo a criação e entrega de
                músicas personalizadas e todo o conteúdo digital relacionado.
              </p>
            </section>

            {/* Direitos Autorais */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-3">
                3. Direitos autorais e licenciamento
              </h2>
              <p className="text-base leading-relaxed">
                Todas as obras criadas pelo Studio Art Hub — incluindo letras,
                melodias, arranjos, mixagens e capas — são protegidas pela{" "}
                <strong>Lei nº 9.610/98 (Lei de Direitos Autorais)</strong>.
              </p>
              <p className="text-base leading-relaxed mt-3">
                Ao contratar uma música personalizada, o cliente recebe uma{" "}
                <strong>licença de uso pessoal, afetiva e não exclusiva</strong>,
                que permite:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base mt-2">
                <li>ouvir, compartilhar com amigos e familiares;</li>
                <li>publicar em redes sociais pessoais;</li>
                <li>utilizar em eventos privados, vídeos pessoais e presentes.</li>
              </ul>
              <p className="text-base leading-relaxed mt-3">Não é permitido:</p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li>revender, reproduzir comercialmente ou distribuir a obra;</li>
                <li>registrar a música em nome próprio ou como autor;</li>
                <li>alterar a letra ou melodia sem autorização escrita.</li>
              </ul>
              <p className="text-base leading-relaxed mt-3">
                Licenças <strong>exclusivas</strong> e autorizações de uso
                comercial podem ser negociadas individualmente, mediante outro contrato
                específico e valores diferenciados.
              </p>
            </section>

            {/* Conteúdo enviado pelo cliente (revisado) */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-3">
                4. Conteúdo fornecido pelo cliente
              </h2>

              <p className="text-base leading-relaxed">
                Você pode — e é até recomendado — enviar{" "}
                <strong>referências musicais</strong> (artistas, gêneros,
                clima/emoção, instrumentos, BPM aproximado, tom, tema da letra)
                e até links de músicas que você gosta, para orientar a criação.
                A obra final, no entanto, será sempre{" "}
                <strong>original e diferente</strong>, preservando sua
                identidade e evitando riscos autorais.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    - O que pode enviar (inspiração):
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-base">
                    <li>
                      Artistas, gêneros e playlists que representem o{" "}
                      <em>estilo</em> desejado.
                    </li>
                    <li>
                      <em>Clima/emoção</em> (romântico, épico, minimalista,
                      nostálgico etc.).
                    </li>
                    <li>
                      Instrumentação e <em>texturas</em> (piano íntimo, violão
                      acústico, synths, cordas).
                    </li>
                    <li>
                      Ritmo/BPM aproximado, tonalidade e estrutura sugerida
                      (verso–pré–refrão).
                    </li>
                    <li>Temas e imagens poéticas que expressem a sua história.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    - O que <u>não</u> será reproduzido:
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-base">
                    <li>
                      <strong>Letra</strong> idêntica ou trechos protegidos de
                      terceiros.
                    </li>
                    <li>
                      <strong>Melodia</strong> identificável (hooks, linhas de
                      voz ou riffs característicos).
                    </li>
                    <li>
                      <strong>Samples</strong> de gravações comerciais sem
                      licença.
                    </li>
                    <li>
                      <strong>Arranjos distintivos</strong> que tornem a obra
                      confundível com a original.
                    </li>
                    <li>
                      Marcas, slogans ou conteúdos protegidos por direitos de
                      terceiros.
                    </li>
                  </ul>
                </div>
              </div>

              <p className="text-base leading-relaxed mt-4">
                Observação: <em>ideias gerais</em>, <em>estilo</em>,{" "}
                <em>gênero</em>, <em>andamentos</em> e{" "}
                <em>progressões harmônicas comuns</em> são elementos de linguagem
                e <strong>não constituem cópia</strong>. Ainda assim, o Studio
                Art Hub zela para que a obra resultante seja{" "}
                <strong>original, não confundível</strong> e juridicamente
                segura.
              </p>

              <p className="text-base leading-relaxed mt-3">
                O Studio Art Hub poderá <strong>recusar, editar ou cancelar</strong>{" "}
                pedidos que contenham material que infrinja direitos de
                terceiros, conteúdo ilegal, ofensivo ou discriminatório. O cliente
                declara ter autorização para compartilhar quaisquer materiais
                enviados e assume responsabilidade por seu conteúdo.
              </p>
            </section>

            {/* Uso de IA */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-3">
                5. Uso de Inteligência Artificial criativa
              </h2>
              <p className="text-base leading-relaxed">
                O Studio Art Hub utiliza a IA <strong>Donna Pro®</strong> como{" "}
                <em>ferramenta de apoio</em> à composição, arranjo e voz
                musical. Todo conteúdo gerado passa por{" "}
                <strong>curadoria e autoria final humana</strong>, conduzida por{" "}
                <strong>Josué S. Galvão</strong>. A IA nunca substitui a criação
                humana nem detém qualquer direito autoral.
              </p>
            </section>

            {/* Entrega e revisões */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-3">
                6. Entrega, revisões e garantias
              </h2>
              <p className="text-base leading-relaxed">
                O prazo médio de entrega é de até <strong>2 dias úteis</strong>{" "}
                após a confirmação do pagamento e envio completo do Briefing.
                Estão incluídas até <strong>2 revisões gratuitas</strong> por
                faixa, para ajustes de letra, tom ou arranjo leve.
              </p>
              <p className="text-base leading-relaxed mt-3">
                Revisões adicionais ou alterações significativas podem gerar
                custos extras a ser acordado.
              </p>
            </section>

            {/* Pagamentos */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-3">7. Pagamentos</h2>
              <p className="text-base leading-relaxed">
                Os pagamentos são processados por parceiros especializados como{" "}
                <strong>Pagar.me</strong>. Não armazenamos dados de cartão de
                crédito, sendo tratados apenas status e metadados da transação
                para conciliação e entrega digital.
              </p>
            </section>

            {/* Responsabilidades */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-3">
                8. Limitação de responsabilidade
              </h2>
              <p className="text-base leading-relaxed">
                O Studio Art Hub não se responsabiliza por:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li>erros de envio de informações incorretas pelo cliente;</li>
                <li>uso indevido das obras entregues fora do escopo autorizado;</li>
                <li>
                  falhas temporárias de servidores, provedores ou integrações de
                  terceiros.
                </li>
              </ul>
            </section>

            {/* Alterações */}
            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3">
                9. Alterações e validade
              </h2>
              <p className="text-base leading-relaxed">
                Estes Termos poderão ser atualizados a qualquer momento, com
                efeitos imediatos após sua publicação. Recomendamos a consulta
                periódica desta página para acompanhar alterações.
              </p>
              <p className="text-base leading-relaxed mt-3">
                A continuidade do uso dos serviços após modificações implica
                concordância com as novas condições.
              </p>
            </section>
          </article>
        </section>
      </main>

      <Footer />
    </>
  );
}
