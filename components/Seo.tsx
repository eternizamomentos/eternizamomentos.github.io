import Head from "next/head";

type Props = {
  title: string;
  description: string;
  path?: string;        // ex: "/preco"
  image?: string;       // ex: "/og.jpg" (coloque esse arquivo em /public)
  noindex?: boolean;    // true para páginas que não devem indexar
  jsonLd?: object;      // schema opcional por página
};

const SITE = "https://www.studioarthub.com";
const DEFAULT_IMAGE = "/og.jpg";

export default function Seo({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  noindex = false,
  jsonLd,
}: Props) {
  const url = `${SITE}${path}`;
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow" />
      )}

      {/* Canonical */}
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Studio Art Hub" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* JSON-LD opcional */}
      {jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      ) : null}
    </Head>
  );
}
