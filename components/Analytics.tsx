// components/Analytics.tsx
import Script from "next/script";
import React from "react";

const isProd = process.env.NODE_ENV === "production";

/**
 * Carrega Google Tag Manager somente em produção.
 * Importante: <Script /> deve ficar FORA de <Head>.
 * Dica: o <noscript> recomendado pelo GTM deve ser adicionado em _document.tsx (body).
 */
export default function Analytics(): JSX.Element | null {
  if (!isProd) return null;

  return (
    <>
      {/* Inicializa dataLayer cedo */}
      <Script id="gtm-datalayer" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];`}
      </Script>

      {/* Google Tag Manager (substitua GTM-XXXXXXX pelo ID real) */}
      <Script id="gtm-init" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');`}
      </Script>
    </>
  );
}
