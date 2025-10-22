import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="pt-BR">
        <Head>
          {/* Cor do navegador (Android/iOS) */}
          <meta name="theme-color" content="#F7F5F2" />
          {/* Meta de robots para páginas públicas (ajustaremos por página quando necessário) */}
          <meta name="robots" content="index,follow" />
          {/* Ícones básicos (adicione favicons reais na pasta /public quando quiser) */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          {/* Canonical padrão (ajustado por página via <Seo />) */}
          <link rel="canonical" href="https://www.studioarthub.com/" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
