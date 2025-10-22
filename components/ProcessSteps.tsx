type Step = { title: string; desc: string; icon: JSX.Element; };

const steps: Step[] = [
  { title: "Entrada", desc: "Clique em “Peça sua música” e nos conte a ocasião e a história.", icon: <span aria-hidden className="text-2xl">📝</span> },
  { title: "Briefing", desc: "Você preenche um formulário rápido com detalhes e referências.", icon: <span aria-hidden className="text-2xl">📋</span> },
  { title: "Criação (humano + IA)", desc: "Composição, letra e produção híbrida (equipe + IA Donna Pro®).", icon: <span aria-hidden className="text-2xl">🎛️</span> },
  { title: "Entrega + Pós-venda", desc: "Primeiro corte, até 2 revisões e entrega final + suporte.", icon: <span aria-hidden className="text-2xl">📦</span> },
];

export default function ProcessSteps() {
  return (
    <section aria-labelledby="como-funciona" className="bg-white">
      <div className="container-page py-12 md:py-16">
        <h2 id="como-funciona" className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
          Como Funciona
        </h2>
        <p className="text-gray-600 text-center mt-2 mb-8 md:mb-10">
          Do briefing à entrega final — simples, transparente e emocionante.
        </p>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <li key={i} className="rounded-xl border border-gray-200 p-5 bg-soft-bg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 grid place-items-center rounded-full bg-soft-beige">
                  {s.icon}
                </div>
                <span className="text-xs text-gray-500">Passo {i + 1}</span>
              </div>
              <h3 className="mt-3 font-semibold text-gray-900">{s.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
