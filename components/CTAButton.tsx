import React from "react";

interface CTAButtonProps {
  href: string;
  label: string;
  target?: "_blank" | "_self";
  rel?: string;
  className?: string;
}

/**
 * Botão CTA oficial do Studio Art Hub — padrão visual da página de manutenção.
 * Mantém acessibilidade, responsividade e consistência entre páginas.
 */
export default function CTAButton({
  href,
  label,
  target = "_self",
  rel,
  className = "",
}: CTAButtonProps) {
  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? rel ?? "noopener noreferrer" : rel}
      className={`cta-button ${className}`}
    >
      {label}
      <style jsx>{`
        .cta-button {
          display: inline-block;
          background-color: #c7355d;
          color: #fff;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-family: "Segoe UI", system-ui, sans-serif;
          transition: background-color 0.3s ease, transform 0.15s ease;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        .cta-button:hover {
          background-color: #a62c4d;
          transform: translateY(-1px);
        }

        .cta-button:active {
          transform: translateY(0);
        }

        .cta-button:focus-visible {
          outline: 2px solid #e7b75f;
          outline-offset: 3px;
        }

        @media (max-width: 600px) {
          .cta-button {
            padding: 10px 20px;
            font-size: 0.95rem;
          }
        }
      `}</style>
    </a>
  );
}
