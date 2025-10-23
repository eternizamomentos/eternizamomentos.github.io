import { useEffect } from "react";
import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bypass = params.get("preview");

    // Se não houver parâmetro especial, redireciona para manutenção
    if (!bypass) {
      window.location.href = "/maintenance.html";
    }
  }, []);

  return <Component {...pageProps} />;
}
