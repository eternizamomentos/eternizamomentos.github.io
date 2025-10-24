import Link from "next/link";
import { useState, useEffect, useId } from "react";
import CTAButton from "../components/CTAButton"; // ✅ Import correto no topo

function SkipToContent() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white text-gray-900 px-4 py-2 rounded shadow"
    >
      Pular para o conteúdo
    </a>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const navId = useId();

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
      <SkipToContent />
      <div className="container-page py-3 flex items-center justify-between">
        <Link href="/" className="text-lg md:text-xl font-semibold text-gray-800">
          Studio Art Hub
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-5"
          aria-label="Navegação principal"
        >
          <Link href="/" className="text-gray-700 hover:text-gray-900">
            Início
          </Link>
          <Link href="/como-funciona" className="text-gray-700 hover:text-gray-900">
            Como Funciona
          </Link>
          <Link href="/preco" className="text-gray-700 hover:text-gray-900">
            Preço
          </Link>
          <Link href="/contato" className="text-gray-700 hover:text-gray-900">
            Contato
          </Link>

          {/* ✅ Botão CTA premium do header */}
          <CTAButton
            href="https://wa.me/5596991451428?text=Oi!%20Quero%20criar%20uma%20m%C3%BAsica%20personalizada%20com%20voc%C3%AAs."
            label="WhatsApp"
            target="_blank"
          />
        </nav>

        {/* Mobile button */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded border border-gray-300 w-10 h-10 hover:bg-soft-bg"
          aria-controls={navId}
          aria-expanded={open}
          aria-label="Abrir menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden className="w-5 h-0.5 bg-gray-800 block relative">
            <span className="absolute -top-2 left-0 w-5 h-0.5 bg-gray-800"></span>
            <span className="absolute top-2 left-0 w-5 h-0.5 bg-gray-800"></span>
          </span>
        </button>
      </div>

      {/* Mobile nav */}
      <nav
        id={navId}
        className={`md:hidden border-t border-gray-200 ${
          open ? "block" : "hidden"
        }`}
        aria-label="Navegação principal (mobile)"
      >
        <div className="container-page py-3 flex flex-col gap-2">
          <Link href="/" className="py-2 text-gray-800">
            Início
          </Link>
          <Link href="/como-funciona" className="py-2 text-gray-800">
            Como Funciona
          </Link>
          <Link href="/preco" className="py-2 text-gray-800">
            Preço
          </Link>
          <Link href="/contato" className="py-2 text-gray-800">
            Contato
          </Link>

          {/* ✅ Botão CTA no mobile (versão padrão visual igual à manutenção) */}
          <CTAButton
            href="https://wa.me/5596991451428?text=Oi!%20Quero%20criar%20uma%20m%C3%BAsica%20personalizada%20com%20voc%C3%AAs."
            label="Falar no WhatsApp"
            target="_blank"
          />
        </div>
      </nav>
    </header>
  );
}
