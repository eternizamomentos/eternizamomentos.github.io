import { useEffect, useRef, useState } from "react";

type AudioSource = {
  src: string;
  type?: string; // ex: "audio/mpeg", "audio/mp4"
};

type AudioPlayerProps = {
  title: string;
  coverSrc?: string;
  caption?: string;
  /** Texto meta para embutir (ex.: "ChatGPT Image 26 de out. de 2025, 15_26_21") */
  metaNote?: string;
  /** Use EITHER `src` OR `sources` */
  src?: string;
  sources?: AudioSource[];
};

function formatTime(t: number) {
  if (!isFinite(t) || t < 0) return "0:00";
  const m = Math.floor(t / 60).toString();
  const s = Math.floor(t % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function AudioPlayer({
  src,
  sources,
  title,
  coverSrc,
  caption,
  metaNote,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => () => audioRef.current?.pause(), []);

  const onToggle = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      try {
        await el.play();
        setIsPlaying(true);
      } catch {
        /* autoplay bloqueado */
      }
    }
  };

  const onTimeUpdate = () => {
    const el = audioRef.current;
    if (!el) return;
    const p = el.currentTime / (el.duration || 1);
    setProgress(p);
    setCurrent(el.currentTime);
    setDuration(isFinite(el.duration) ? el.duration : 0);
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    if (!el) return;
    const val = Number(e.target.value);
    el.currentTime = val * (el.duration || 0);
  };

  const onLoaded = () => {
    const el = audioRef.current;
    if (!el) return;
    setDuration(isFinite(el.duration) ? el.duration : 0);
  };

  const onEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrent(0);
  };

  return (
    <figure
      className="rounded-2xl overflow-hidden bg-white shadow-sm border border-[#E7E4DF]"
      aria-label={`Player de áudio: ${title}`}
      // Embute meta como atributo de dados (não polui a UI)
      data-origin={metaNote || undefined}
    >
      {/* Capa — agora 3:2 */}
      <div className="relative aspect-[3/2] bg-[var(--color-bg)]">
        {coverSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverSrc}
            alt="" // capa é decorativa; título já está fora
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full" style={{ background: "var(--gradient-rose-glow)" }} />
        )}

        {/* Botão play/pause flutuante */}
        <button
          type="button"
          onClick={onToggle}
          className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-white font-semibold"
          style={{ background: "var(--color-cta)", transition: "background .25s ease" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "var(--color-cta-hover)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "var(--color-cta)")
          }
          aria-pressed={isPlaying}
          aria-label={isPlaying ? "Pausar" : "Reproduzir"}
        >
          <span
            className="inline-block w-0 h-0 border-y-8 border-y-transparent border-l-[14px] border-l-white"
            style={{ display: isPlaying ? "none" : "inline-block" }}
            aria-hidden={isPlaying}
          />
          <span
            className="flex gap-[4px]"
            style={{ display: isPlaying ? "inline-flex" : "none" }}
            aria-hidden={!isPlaying}
          >
            <span className="w-[4px] h-4 bg-white rounded-sm" />
            <span className="w-[4px] h-4 bg-white rounded-sm" />
          </span>
          <span>{isPlaying ? "Pausar" : "Ouvir"}</span>
        </button>
      </div>

      <figcaption className="p-4">
        {/* Título e legenda */}
        <div className="flex flex-col gap-1">
          <strong className="text-[var(--color-navy)]">{title}</strong>
          {caption && <span className="text-sm text-[var(--color-text-muted)]">{caption}</span>}

          {/* Meta escondida (acessível) — NÃO aparece visualmente, mas fica disponível para leitores de tela */}
          {metaNote && <span className="sr-only">{metaNote}</span>}

          {/* Se quiser exibir a meta visível, troque a linha acima por esta:
          {metaNote && (
            <span className="text-[11px] text-[var(--color-text-muted)]/70">
              {metaNote}
            </span>
          )} */}
        </div>

        {/* Barra de progresso */}
        <div className="mt-3">
          <input
            aria-label="Progresso"
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={progress}
            onChange={onSeek}
            className="w-full accent-[var(--color-cta)]"
          />
          <div className="flex justify-between text-xs text-[var(--color-text-muted)] mt-1">
            <span>{formatTime(current)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </figcaption>

      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoaded}
        onEnded={onEnded}
      >
        {sources?.length
          ? sources.map((s, i) => <source key={i} src={s.src} type={s.type} />)
          : src
          ? <source src={src} />
          : null}
        Seu navegador não suporta áudio HTML5.
      </audio>
    </figure>
  );
}
