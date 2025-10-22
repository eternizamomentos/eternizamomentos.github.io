import Head from "next/head";
import Header from "../components/Header";

export default function ComoFunciona() {
  return (
    <>
      <Head>
        <title>Como Funciona — Studio Art Hub</title>
        <meta name="description" content="Entenda o passo a passo de criação: briefing, composição humano + IA, mix/master e entrega com até 2 revisões." />
      </Head>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900">Como Funciona</h1>
        <p className="mt-4 text-gray-700">
          Em breve, conteúdo detalhado. Por enquanto, utilize a Home para iniciar seu pedido.
        </p>
      </main>
    </>
  );
}
