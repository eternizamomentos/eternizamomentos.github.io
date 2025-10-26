import dynamic from "next/dynamic";
import Layout from "../components/Layout";
import Hero from "../components/Hero";
import ValueBar from "../components/ValueBar";
import TrustBadges from "../components/TrustBadges";
import Seo from "../components/Seo";
import FeaturedSamples from "../components/FeaturedSamples";

// Carrossel → lazy (reduz JS inicial e melhora FCP/LCP)
const TestimonialCarousel = dynamic(
  () => import("../components/TestimonialCarousel"),
  {
    ssr: false,
    loading: () => (
      <section
        className="container-page py-10 text-center text-sm text-gray-500"
        aria-busy="true"
      >
        Carregando depoimentos…
      </section>
    ),
  }
);

export default function Home() {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Studio Art Hub",
    url: "https://www.studioarthub.com",
    logo: "https://www.studioarthub.com/logo.png",
    sameAs: [
      "https://www.instagram.com/virtualbrushhub/",
      "https://www.tiktok.com/@arthubstudio",
    ],
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Música Personalizada",
    description:
      "Composição e produção musical personalizada com 2 revisões, MP3 + capa personalizada, prova de criação e registro no EDA.",
    brand: { "@type": "Brand", name: "Studio Art Hub" },
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: "497",
      availability: "https://schema.org/InStock",
      url: "https://www.studioarthub.com/preco",
    },
  };

  return (
    <Layout>
      <Seo
        title="Studio Art Hub — Música personalizada que eterniza sua história"
        description="Não é só uma música. É a sua história, eternizada em som. Composição original, 2 revisões, MP3 + capa, prova de criação e registro no EDA."
        path="/"
        image="/og.jpg"
        jsonLd={{ "@graph": [orgSchema, productSchema] }}
      />

      <main id="main">
        <Hero />
        <ValueBar />
        <TrustBadges />

        {/* Amostras com player premium */}
        <FeaturedSamples />

        <section aria-label="Processo e Depoimentos">
          {/* ProcessSteps pode ser reativado depois, logo acima do carrossel */}
          {/* import { default as ProcessSteps } from "../components/ProcessSteps"; */}
        </section>

        <TestimonialCarousel />
      </main>
    </Layout>
  );
}
