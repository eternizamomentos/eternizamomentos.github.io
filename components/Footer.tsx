export default function Footer() {
  return (
    <footer
      className="py-10 text-center border-t"
      style={{
        borderColor: "#E7E4DF", // cor oficial de borda do design system
        backgroundColor: "#FFFBF7",
        color: "#667085",
        fontFamily: '"Segoe UI", system-ui, sans-serif',
      }}
    >
      <div className="container-page px-4">
        <p
          style={{
            fontSize: "0.95rem",
            marginBottom: "0.25rem",
          }}
        >
          © {new Date().getFullYear()}{" "}
          <strong style={{ color: "#101828" }}>Studio Art Hub</strong> · Todos os direitos reservados
        </p>

        <p style={{ fontSize: "0.85rem", margin: 0 }}>
          Desenvolvido com ❤️ por{" "}
          <a
            href="https://studioarthub.com"
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
