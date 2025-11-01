import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="py-10 text-center border-t"
      style={{
        borderColor: "#E7E4DF", // borda oficial do design system
        backgroundColor: "#FFFBF7",
        color: "#667085",
        fontFamily: '"Segoe UI", system-ui, sans-serif',
      }}
    >
      <div className="container-page px-4 flex flex-col items-center space-y-3">
        {/* Marca e direitos autorais */}
        <p
          style={{
            fontSize: "0.95rem",
            marginBottom: "0.25rem",
          }}
        >
          © {currentYear}{" "}
          <strong style={{ color: "#101828" }}>Studio Art Hub</strong> · Todos os
          direitos reservados.
        </p>

        {/* Identificação legal */}
        <p
          style={{
            fontSize: "0.85rem",
            margin: 0,
            lineHeight: "1.4",
          }}
        >
          CNPJ: 55.028.904/0001-17 · info@studioarthub.com
        </p>

        {/* Links legais (internos via Link) */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            marginTop: "0.25rem",
            fontSize: "0.85rem",
          }}
        >
          <Link
            href="/politica-de-privacidade"
            style={{
              color: "#C7355D",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Política de Privacidade
          </Link>

          <Link
            href="/termos-de-uso"
            style={{
              color: "#C7355D",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Termos de Uso
          </Link>
        </div>

        {/* Assinatura e crédito (externo permanece <a>) */}
        <p
          style={{
            fontSize: "0.8rem",
            marginTop: "0.75rem",
            color: "#98A2B3",
          }}
        >
          Desenvolvido com ❤️ por{" "}
          <a
            href="https://www.studioarthub.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#C7355D",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Studio Art Hub
          </a>
        </p>
      </div>
    </footer>
  );
}
