import Header from "./Header";
import Footer from "./Footer";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#FFFBF7",
      }}
    >
      {/* Header fixo para evitar gaps visuais */}
      <Header />

      {/* Main com overflow:hidden evita colapso de margens */}
      <main
        id="main"
        style={{
          flex: 1,
          overflow: "hidden", // ✅ corrige colapso de margens
        }}
      >
        {children}
      </main>

      <Footer />
    </div>
  );
}
