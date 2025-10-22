import Head from "next/head";

const isProd = process.env.NODE_ENV === "production";

export default function Analytics() {
  if (!isProd) return null;
  return (
    <Head>
      {/* Google Analytics (substitua pelo seu ID) */}
      {/* <script
  dangerouslySetInnerHTML={{
    __html: `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-XXXXXXX');
    `,
  }}
/> */}
      {/* Meta Pixel (adicione seu ID quando tiver) */}
    </Head>
  );
}
