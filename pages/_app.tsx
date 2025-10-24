import type { AppProps } from "next/app";
import "../styles/globals.css";
import { useEffect, useState } from "react";
import CTAButton from "../components/CTAButton"; // ✅ Import correto no topo

export default function MyApp({ Component, pageProps }: AppProps) {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bypass = params.get("preview");
    const isLocal = window.location.hostname === "localhost";

    if (!bypass) {
      if (isLocal) {
        setIsAllowed(false);
        return;
      }

      if (!window.location.pathname.includes("maintenance.html")) {
        window.location.replace("/maintenance.html");
        return;
      }
    } else {
      setIsAllowed(true);
    }
  }, []);

  if (isAllowed === null) return null; // evita flash

  if (isAllowed === false) {
    // Renderiza a página de manutenção local (versão inline)
    return (
      <div
        style={{
          fontFamily: '"Segoe UI", system-ui, sans-serif',
          background: "#FFFBF7",
          color: "#0B1324",
          margin: 0,
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <main style={{ maxWidth: 600, padding: "2rem" }}>
          <h1
            style={{
              fontSize: "2rem",
              color: "#101828",
              marginBottom: "1rem",
            }}
          >
            🎵 Studio Art Hub
          </h1>

          <p
            style={{
              color: "#667085",
              fontSize: "1.1rem",
              marginBottom: "2rem",
              lineHeight: 1.6,
            }}
          >
            Estamos <strong>afinando os últimos instrumentos</strong> do nosso novo site.
            <br />
            Em breve, você poderá{" "}
            <em>transformar sua história em música</em> com nossa criação híbrida — humana + IA{" "}
            <strong>Donna Pro®</strong>.
          </p>

          {/* ✅ Aqui usamos o CTAButton normalmente */}
          <CTAButton
            href="https://wa.me/5596991451428?text=Oi!%20Quero%20criar%20uma%20m%C3%BAsica%20personalizada%20com%20voc%C3%AAs."
            label="Fale conosco no WhatsApp"
            target="_blank"
          />

          <footer
            style={{
              marginTop: "3rem",
              color: "#667085",
              fontSize: "0.9rem",
            }}
          >
            © {new Date().getFullYear()} Studio Art Hub · Todos os direitos reservados
          </footer>
        </main>
      </div>
    );
  }

  // Se permitido → render normal
  return <Component {...pageProps} />;
}
