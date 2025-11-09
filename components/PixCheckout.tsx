"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { createPixOrder } from "../utils/api";
import { logFrontend } from "../utils/logger"; // 🪵 Novo sistema de logs

// Tipagem explícita para evitar uso de `any`
type PixTransaction = {
  qr_code?: string;
  qr_code_url?: string;
  expires_at?: string;
};

type PixCharge = {
  id?: string;
  status?: string;
  last_transaction?: PixTransaction;
};

type PixPedido = {
  ok: boolean;
  mode?: "test" | "live";
  charge?: PixCharge;
  error?: string;
};

function formatHMS(totalSeconds: number) {
  const sec = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function PixCheckout() {
  const [carregando, setCarregando] = useState(false);
  const [pedido, setPedido] = useState<PixPedido | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  // cronômetro
  const [restante, setRestante] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  // extrai dados úteis do pedido
  const expiresAt = useMemo(() => {
    const iso = pedido?.charge?.last_transaction?.expires_at;
    return iso ? new Date(iso).getTime() : null;
  }, [pedido]);

  const copiaECola = pedido?.charge?.last_transaction?.qr_code || "";

  // controla contagem regressiva
  useEffect(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!expiresAt) {
      setRestante(null);
      return;
    }

    const tick = () => {
      const diff = Math.floor((expiresAt - Date.now()) / 1000);
      setRestante(diff);
      if (diff <= 0 && timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    tick();
    timerRef.current = window.setInterval(tick, 1000);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [expiresAt]);

  const gerarPix = async () => {
  setCarregando(true);
  setErro(null);
  setPedido(null);

  // 🪵 LOG: clique no botão
  logFrontend({
    step: "pix_click",
    status: "pending",
    message: "Usuário clicou em Gerar Pix",
   }); 
    
  try {
    const dados = {
      amount: 100,
      description: "Música personalizada Studio Art Hub",
      customer: {
        name: "Josué Silva Galvão",
        email: "info@studioarthub.com",
        document: "89173511234",
        phone: { country_code: "55", area_code: "96", number: "991451428" },
      },
      pix: { expires_in: 3600 },
    };

    // 🪵 LOG: requisição enviada
    logFrontend({
      step: "pix_request_sent",
      status: "pending",
      meta: { amount: dados.amount },
    });

    const resposta: PixPedido = await createPixOrder(dados);

    if (!resposta?.ok) {
      // 🪵 LOG: resposta com erro
      logFrontend({
        step: "pix_error",
        level: "error",
        status: "error",
        error: resposta?.error || "Erro desconhecido ao gerar Pix",
      });
      throw new Error(resposta?.error || "Erro ao gerar o Pix.");
    }

    // 🪵 LOG: sucesso
    logFrontend({
      step: "pix_success",
      status: "ok",
      message: "Pix criado com sucesso",
      meta: {
        charge_id: resposta?.charge?.id || null,
        charge_status: resposta?.charge?.status || null,
        has_qr: Boolean(resposta?.charge?.last_transaction?.qr_code),
        expires_at: resposta?.charge?.last_transaction?.expires_at || null,
      },
    });

    setPedido(resposta);
  } catch (err: unknown) {
    const e = err instanceof Error ? err : new Error(String(err));
    console.error("❌ PIX ERROR", e);
    // 🪵 LOG: exceção
    logFrontend({
      step: "pix_error",
      level: "error",
      status: "error",
      error: e.message,
    });
    setErro("Falha ao gerar o Pix. Verifique sua conexão e tente novamente.");
  } finally {
    // 🪵 LOG: finalização
    logFrontend({
      step: "pix_finish",
      status: "done",
    });
    setCarregando(false);
  }
};
  
  const copiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(copiaECola);
      setErro(null);
      // 🪵 LOG: copiou Pix
      logFrontend({
        step: "pix_copy",
        status: "ok",
      });
      const btn = document.getElementById("btn-copiar-pix");
      if (btn) {
        const original = btn.textContent;
        btn.textContent = "Copiado ✔️";
        setTimeout(() => {
          if (btn) btn.textContent = original || "Copiar código Pix";
        }, 1800);
      }
    } catch {
      setErro("Não foi possível copiar o código. Copie manualmente.");
      // 🪵 LOG: erro ao copiar
      logFrontend({
        step: "pix_error",
        level: "warn",
        status: "error",
        error: "clipboard_write_failed",
      });
    }
  };

  const expirado = typeof restante === "number" && restante <= 0;

  return (
    <div className="text-center py-10">
      {!pedido && (
        <>
          <h2 className="text-2xl font-semibold mb-4">
            Finalize seu pedido 🎵
          </h2>
          <p className="text-[#667085] mb-6">
            Clique no botão abaixo para gerar seu Pix de R$ 497,00.
          </p>
          <button
            onClick={gerarPix}
            disabled={carregando}
            className="btn-primary px-6 py-3 rounded-md bg-[#C7355D] text-white font-medium hover:bg-[#a72d4f] transition"
          >
            {carregando ? "Gerando Pix..." : "Gerar Pix"}
          </button>
          {erro && <p className="text-red-600 mt-4">{erro}</p>}
        </>
      )}

      {pedido && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-2">Seu Pix está pronto 💰</h3>
          <p className="text-gray-700 mb-6">
            Escaneie o QR Code abaixo ou copie o código Pix.
          </p>

          <div className="flex flex-col items-center space-y-4">
            {copiaECola ? (
              <QRCodeCanvas value={copiaECola} size={240} includeMargin level="H" />
            ) : (
              <div className="w-60 h-60 flex items-center justify-center rounded-md border border-gray-300 text-gray-500">
                QR Code indisponível
              </div>
            )}

            <div className="w-full max-w-md">
              <label
                htmlFor="pix-code"
                className="block text-left text-sm text-gray-600 mb-1"
              >
                Código Pix (copia e cola)
              </label>
              <textarea
                id="pix-code"
                readOnly
                value={copiaECola || "Código Pix não disponível"}
                className="w-full text-sm border border-gray-300 rounded-md p-2"
                rows={4}
              />
              <div className="flex items-center justify-between mt-2">
                <button
                  id="btn-copiar-pix"
                  onClick={copiarCodigo}
                  disabled={!copiaECola}
                  className="px-4 py-2 rounded-md bg-[#E7B75F] text-[#0B1324] font-medium hover:brightness-95 transition disabled:opacity-60"
                >
                  Copiar código Pix
                </button>

                <div className="text-sm text-gray-700">
                  {expiresAt ? (
                    expirado ? (
                      <span className="text-red-600 font-medium">Expirado</span>
                    ) : (
                      <>
                        <span className="font-medium">Tempo restante:</span>{" "}
                        <span aria-live="polite" className="tabular-nums">
                          {formatHMS(restante ?? 0)}
                        </span>
                      </>
                    )
                  ) : (
                    <span>—</span>
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Expira em:{" "}
                {expiresAt
                  ? new Date(expiresAt).toLocaleString("pt-BR")
                  : "—"}
              </p>
            </div>

            {erro && <p className="text-red-600">{erro}</p>}
            {expirado && (
              <div className="text-sm text-[#C7355D] mt-2">
                O QR Code expirou. Clique em <strong>Gerar Pix</strong> para
                criar um novo.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
