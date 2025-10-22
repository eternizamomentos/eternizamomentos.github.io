import Head from "next/head";
import Header from "../components/Header";

export default function Preco() {
  return (
    <>
      <Head>
        <title>Preço — Studio Art Hub</title>
        <meta name="description" content="Pacote Único: R$497 — composição original, produção, capa, 2 revisões, prova de criação, registro no EDA e entrega digital." />
      </Head>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900">Preço</h1>
        <p className="mt-4 text-gray-700">Pacote Único — R$ 497.</p>
      </main>
    </>
  );
}
