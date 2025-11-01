import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PoliticaDePrivacidadePage() {
  const updatedAt = "01/11/2025"; // Atualize sempre que editar o texto

  return (
    <>
      <Head>
        <title>Política de Privacidade | Studio Art Hub</title>
        <meta
          name="description"
          content="Entenda como o Studio Art Hub coleta, utiliza, armazena e protege seus dados pessoais em conformidade com a LGPD."
        />
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <Header />

      <main id="main" className="bg-[#FFFBF7] text-[#0B1324]">
        <section className="container-page px-4 py-16">
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-semibold mb-3">
              Política de Privacidade
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
                <strong>Studio Art Hub</strong> — criação de músicas
                personalizadas sob medida. Operamos como MEI.
                <br />
                <strong>CNPJ:</strong> 55.028.904/0001-17
                <br />
                <strong>E-mail:</strong>{" "}
                <a
                  href="https://mail.google.com/mail/?view=cm&to=info@studioarthub.com&su=Solicitação%20de%20Informações&body=Olá,%20gostaria%20de%20saber%20mais%20sobre%20sua%20Política%20de%20Privacidade."
                  className="text-[#C7355D] font-medium hover:underline transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  info@studioarthub.com
                </a>
                <br />
                <strong>Site:</strong>{" "}
                <a href="https://www.studioarthub.com"
                  className="text-[#C7355D] font-medium hover:underline transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer">
                  www.studioarthub.com
                </a>
              </p>
            </section>

            {/* Dados coletados */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-3">2. Dados que coletamos</h2>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li>
                  <strong>Contato:</strong> nome, e-mail, celular/WhatsApp e
                  mensagens enviadas por formulários ou chat.
                </li>
                <li>
                  <strong>Briefing criativo:</strong> história, preferências
                  musicais e referências fornecidas voluntariamente.
                </li>
                <li>
                  <strong>Transações:</strong> status e metadados do pagamento
                  processados por terceiros (ex.: Pagar.me). Não armazenamos
                  dados completos de cartão.
                </li>
                <li>
                  <strong>Navegação:</strong> dados técnicos mínimos (IP
                  parcial, dispositivo, páginas acessadas). Cookies/analytics
                  poderão ser ativados futuramente (ver item 6).
                </li>
              </ul>
            </section>

            {/* Bases legais e finalidades */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-3">
                3. Bases legais e finalidades
              </h2>
              <p className="text-base leading-relaxed">
                Tratamos dados conforme a LGPD (Lei 13.709/2018), com base em:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li>
                  <strong>Execução de contrato</strong> — criar e entregar sua
                  música personalizada, realizar revisões e suporte.
                </li>
                <li>
                  <strong>Consentimento</strong> — receber comunicações, usar
                  conteúdos enviados em portfólio (quando autorizado).
                </li>
                <li>
                  <strong>Interesse legítimo</strong> — melhorar serviços e
                  garantir segurança antifraude.
                </li>
                <li>
                  <strong>Cumprimento legal</strong> — obrigações fiscais e
                  contábeis.
                </li>
              </ul>
            </section>

            {/* Compartilhamento */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-3">
                4. Compartilhamento com terceiros
              </h2>
              <p className="text-base leading-relaxed">
                Compartilhamos dados estritamente necessários com:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li>
                  <strong>Meios de pagamento (Pagar.me):</strong> processamento
                  de Pix/cartão/boletos e prevenção a fraudes.
                </li>
                <li>
                  <strong>Ferramentas de comunicação:</strong> e-mail e WhatsApp
                  para atendimento e entrega digital.
                </li>
                <li>
                  <strong>Arquivamento e prova de criação:</strong> registros
                  internos de autoria, certificados e evidências técnicas no Escritório de Direitos Autorais (EDA) da Biblioteca Nacional.
                </li>
              </ul>
              <p className="text-base leading-relaxed mt-3">
                Não vendemos dados pessoais. O compartilhamento ocorre apenas
                para fins operacionais, legais ou mediante consentimento.
              </p>
            </section>

            {/* IA e Provas de criação */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-3">
                5. IA criativa e provas de criação
              </h2>
              <p className="text-base leading-relaxed">
                Utilizamos <strong>IA criativa (Donna Pro®)</strong> como{" "}
                <em>ferramenta de apoio</em> à composição, sempre com curadoria
                humana (músico Josué S. Galvão). Mantemos{" "}
                <strong>prints, rascunhos e metadados técnicos</strong> para
                fins de prova de criação e autenticação autoral (incluindo{" "}
                <strong>Certificado de Criação</strong> e registros EDA.
              </p>
            </section>

            {/* Cookies e analytics */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-3">6. Cookies e analytics</h2>
              <p className="text-base leading-relaxed">
                Podemos utilizar cookies e ferramentas de análise (ex.: GA4,
                Meta Pixel) para entender uso do site e melhorar a experiência.
                Quando ativados, exibiremos aviso de consentimento e
                disponibilizaremos preferências para o titular gerenciar.
              </p>
            </section>

            {/* Direitos do titular */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-3">
                7. Direitos do titular (LGPD)
              </h2>
              <p className="text-base leading-relaxed">
                Você pode solicitar, a qualquer momento:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li>confirmação e acesso aos seus dados;</li>
                <li>correção de dados incompletos, inexatos ou desatualizados;</li>
                <li>anonimização, bloqueio ou eliminação de dados desnecessários;</li>
                <li>portabilidade e informações sobre compartilhamentos;</li>
                <li>revogação de consentimento.</li>
              </ul>
              <p className="text-base leading-relaxed mt-3">
                Para exercer seus direitos, escreva para{" "}
                <a
                  href="https://mail.google.com/mail/?view=cm&to=info@studioarthub.com&su=Solicitação%20de%20Informações&body=Olá,%20gostaria%20de%20saber%20mais%20sobre%20sua%20Política%20de%20Privacidade."
                  className="text-[#C7355D] font-medium hover:underline transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  info@studioarthub.com
                </a>
                .
              </p>
            </section>

            {/* Segurança e retenção */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-3">
                8. Segurança e retenção
              </h2>
              <p className="text-base leading-relaxed">
                Adotamos medidas técnicas e administrativas para proteger seus
                dados contra acessos não autorizados, destruição ou perda. Os
                dados são mantidos pelo tempo necessário às finalidades
                informadas, observadas exigências legais, fiscais e de
                preservação de provas de criação.
              </p>
            </section>

            {/* Pagamentos */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-3">9. Pagamentos</h2>
              <p className="text-base leading-relaxed">
                Pagamentos são processados por parceiros especializados (ex.:
                <strong> Pagar.me</strong>). Não armazenamos dados sensíveis de
                cartão. Usamos apenas referências e status de pagamento para
                conciliação e atendimento.
              </p>
            </section>

            {/* Alterações */}
            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3">
                10. Alterações desta Política
              </h2>
              <p className="text-base leading-relaxed">
                Podemos atualizar esta Política para refletir melhorias, novas
                funcionalidades, requisitos legais ou regulatórios. A versão em
                vigor é sempre a publicada nesta página, com a data de
                atualização indicada no topo.
              </p>
            </section>
          </article>
        </section>
      </main>

      <Footer />
    </>
  );
}
