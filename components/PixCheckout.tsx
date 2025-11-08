"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { createPixOrder } from "../utils/api";

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

  // 🔹 trace_id único por tentativa
  const traceId = `pix_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // 🔹 logger simples (futuro: envia para Cloudflare/Backend Local)
  const logEvent = async (
    step: string,
    data: Record<string, unknown> = {}
  ): Promise<void> => {

    const payload = {
      trace_id: traceId,
      step,
      ts: new Date().toISOString(),
      page: "/preco",
      flow: "pix_checkout",
      ...data,
    };
    console.log("📋 [PIX LOG]", payload);
    try {
      // 🔁 se quiser enviar remotamente:
      await fetch("https://studioarthub-api.rapid-hill-dc23.workers.dev/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // falha silenciosa no logEvent não interrompe o fluxo
    }
  };

  await logEvent("start_click", { status: "pending" });

  try {
    const dados = {
      amount: 49700,
      description: "Música personalizada Studio Art Hub",
      customer: {
        name: "Josué Silva Galvão",
        email: "info@studioarthub.com",
        document: "89173511234",
        phone: { country_code: "55", area_code: "96", number: "991451428" },
      },
      pix: { expires_in: 3600 },
    };

    await logEvent("request_sent", { status: "sending", payload_preview: dados });

    const resposta: PixPedido = await createPixOrder(dados);

    if (!resposta?.ok) {
      await logEvent("response_error", {
        status: "error",
        response_preview: resposta,
      });
      throw new Error(resposta?.error || "Erro ao gerar o Pix.");
    }

    await logEvent("response_success", {
      status: "success",
      charge_id: resposta?.charge?.id,
      order_id: resposta?.charge?.last_transaction ? "found_tx" : "no_tx",
      mode: resposta?.mode,
    });

    setPedido(resposta);
  } catch (err: unknown) {
    const e = err instanceof Error ? err : new Error(String(err));
    console.error("❌ PIX ERROR", e);
    await logEvent("exception", {
      status: "failed",
      message: e.message,
      stack: e.stack,
    });
    setErro("Falha ao gerar o Pix. Verifique sua conexão e tente novamente.");
  } finally {
    await logEvent("finish", { status: "done" });
    setCarregando(false);
  }
};
  
  const copiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(copiaECola);
      setErro(null);
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
