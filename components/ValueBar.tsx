import CTAButton from "./CTAButton";
export default function ValueBar() {
  return (
    <section aria-labelledby="valor-do-pacote" className="bg-white/80 backdrop-blur border-y border-gray-200">
      <div className="container-page py-6 grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center">
        <h2 id="valor-do-pacote" className="sr-only">Pacote único – o que está incluído</h2>

        <div className="text-2xl md:text-3xl font-bold text-gray-900">
          R$ 497
          <span className="block text-xs md:text-sm font-normal text-gray-500">
            Pacote Único
          </span>
        </div>

        <ul className="flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-2 text-sm text-gray-700">
          <li>2 revisões</li>
          <li>MP3 + capa personalizada</li>
          <li>Prova de criação</li>
          <li>Registro no EDA</li>
        </ul>

<CTAButton
  href="https://docs.google.com/forms/d/e/1FAIpQLSeAD0LAytFFMwwMwj1WbKgutcJGoWKtNfr4j-z08vGT3TtX3w/viewform"
  label="Peça sua música"
  target="_blank"
/>
      </div>
    </section>
  );
}
