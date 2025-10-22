import Head from "next/head";
import Header from "../components/Header";

export default function Contato() {
  return (
    <>
      <Head>
        <title>Contato — Studio Art Hub</title>
        <meta name="description" content="Fale com a Studio Art Hub pelo WhatsApp Business ou e-mail de suporte." />
      </Head>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900">Contato</h1>
        <p className="mt-4 text-gray-700">
          WhatsApp Business:{" "}
          <a className="text-accent-gold underline" href="https://wa.me/SEUNUMERO" target="_blank" rel="noopener noreferrer">Abrir conversa</a>
        </p>
        <p className="mt-2 text-gray-700">E-mail: info@studioarthub.com</p>
      </main>
    </>
  );
}
