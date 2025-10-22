import dynamic from "next/dynamic";
import Header from "../components/Header";
import Hero from "../components/Hero";
import ValueBar from "../components/ValueBar";
import TrustBadges from "../components/TrustBadges";
// Carrossel → lazy (reduz JS inicial e melhora FCP/LCP)
const TestimonialCarousel = dynamic(() => import("../components/TestimonialCarousel"), {
  ssr: false,
  loading: () => (
    <section className="container-page py-10 text-center text-sm text-gray-500" aria-busy="true">
      Carregando depoimentos…
    </section>
  ),
});

import Seo from "../components/Seo";

export default function Home() {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Studio Art Hub",
    url: "https://www.studioarthub.com",
    logo: "https://www.studioarthub.com/logo.png",
    sameAs: [
      "https://www.instagram.com/virtualbrushhub/",
      "https://www.tiktok.com/@arthubstudio"
    ]
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Música Personalizada",
    description: "Composição e produção musical personalizada com 2 revisões, MP3 + capa personalizada, prova de criação e registro no EDA.",
    brand: { "@type": "Brand", name: "Studio Art Hub" },
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: "497",
      availability: "https://schema.org/InStock",
      url: "https://www.studioarthub.com/preco"
    }
  };

  return (
    <>
      <Seo
        title="Studio Art Hub — Música personalizada que eterniza sua história"
        description="Não é só uma música. É a sua história, eternizada em som. Composição original, 2 revisões, MP3 + capa, prova de criação e registro no EDA."
        path="/"
        image="/og.jpg"
        jsonLd={{ "@graph": [orgSchema, productSchema] }}
      />

      <Header />

      <main id="main">
        <Hero />
        <ValueBar />
        <TrustBadges />
        <section aria-label="Processo e Depoimentos">
          {/* ProcessSteps já existe; você pode deixá-lo antes do carrossel */}
          {/* import { default as ProcessSteps } from "../components/ProcessSteps"; */}
        </section>
        <TestimonialCarousel />
      </main>

      <footer className="text-center py-10 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Studio Art Hub. Todos os direitos reservados.</p>
      </footer>
    </>
  );
}
