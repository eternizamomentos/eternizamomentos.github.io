export default function TrustBadges() {
  const labels = ["Registro no EDA", "Prova de Criação", "SSL", "Atendimento Humano", "Entrega Digital", "Garantia 2 revisões"];
  return (
    <section aria-labelledby="confianca" className="bg-white">
      <div className="container-page py-10">
        <h2 id="confianca" className="sr-only">Selos de confiança</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {labels.map((label) => (
            <div
              key={label}
              className="border border-gray-200 rounded-lg py-3 px-2 text-center text-xs md:text-sm text-gray-600 bg-soft-bg"
              aria-label={label}
              title={label}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
