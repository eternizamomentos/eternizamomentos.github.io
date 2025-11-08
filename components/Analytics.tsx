// components/Analytics.tsx
import React from "react";
import Script from "next/script";

const isProd = process.env.NODE_ENV === "production";

/**
 * Carrega Google Tag Manager somente em produção.
 * OBS: <Script /> deve ficar FORA de <Head>.
 * Se quiser o <noscript> do GTM (iframe), adicione em pages/_document.tsx dentro do <body>.
 */
export default function Analytics(): React.ReactElement | null {
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
