"use client";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  useCallback,
} from "react";
export type MediaItem = {
  id: string;
  title: string;
  caption: string;
  hint: string;
  art: string;
  project: string;
  fit?: string;
  poster?: string;
  sources: { src: string; type: string; mime: string }[];
};
function subscribeMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function motionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
export function useReducedMotion() {
  return useSyncExternalStore(subscribeMotion, motionSnapshot, () => true);
}
export function MediaPlaceholder({
  item,
  pending = true,
}: {
  item: MediaItem;
  pending?: boolean;
}) {
  return (
    <div
      className={`media-placeholder art-${item.art}`}
      aria-label={`${item.title}: ${item.hint}${pending ? " coming soon" : ""}`}
    >
      <div className="placeholder-index" aria-hidden="true">
        {item.project === "rivering"
          ? "R / SYSTEM STUDY"
          : item.project === "wayjia"
            ? "W / FLIGHT RECORD"
            : "F / PRODUCT VIEW"}
      </div>
      <div className="technical-art" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
        <span className="art-marker">+</span>
      </div>
      <div className="placeholder-text">
        <span>{item.title}</span>
        <small>
          {item.hint}
          {pending ? " · coming soon" : ""}
        </small>
      </div>
      <span className="placeholder-format" aria-hidden="true">
        FILM / STILL
      </span>
    </div>
  );
}
function VideoPreview({ item, paused }: { item: MediaItem; paused: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [near, setNear] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "160px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const node = ref.current;
    if (!node || !near) return;
    let visible = false;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const update = () => {
      if (
        visible &&
        !document.hidden &&
        !reduced &&
        !paused &&
        !connection?.saveData
      )
        void node.play().catch(() => {});
      else node.pause();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        update();
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      node.pause();
    };
  }, [near, reduced, paused]);
  if (failed)
    return (
      <MediaPlaceholder
        item={{ ...item, hint: "Preview unavailable" }}
        pending={false}
      />
    );
  const videos = item.sources.filter((s) => s.type === "video");
  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      poster={item.poster}
      preload={near ? "metadata" : "none"}
      onError={() => setFailed(true)}
      aria-label={`${item.title} muted preview`}
      style={{ objectFit: item.fit === "contain" ? "contain" : "cover" }}
    >
      {near &&
        videos.map((s, i) => (
          <source
            key={s.src}
            src={s.src}
            type={s.mime}
            onError={() => {
              if (i === videos.length - 1) setFailed(true);
            }}
          />
        ))}
      Video preview
    </video>
  );
}
export function MediaPreview({
  item,
  priority = false,
  paused = false,
}: {
  item: MediaItem;
  priority?: boolean;
  paused?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const reduced = useReducedMotion();
  const source = item.sources[0];
  if (!source || failed) return <MediaPlaceholder item={item} />;
  if (source.type === "video")
    return <VideoPreview item={item} paused={paused} />;
  if (source.type === "gif" && (reduced || paused) && !item.poster)
    return (
      <MediaPlaceholder
        item={{ ...item, hint: "Animation paused · open to play" }}
        pending={false}
      />
    );
  return (
    <img
      src={
        source.type === "gif" && (reduced || paused) ? item.poster : source.src
      }
      alt={item.title}
      width={1600}
      height={1000}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onError={() => setFailed(true)}
      style={{ objectFit: item.fit === "contain" ? "contain" : "cover" }}
    />
  );
}
export function Gallery({
  items,
  featured = false,
}: {
  items: MediaItem[];
  featured?: boolean;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const available = items.filter((item) => item.sources.length > 0);
  const selectedItem = selected === null ? null : available[selected];
  const move = useCallback(
    (delta: number) =>
      setSelected((current) =>
        current === null
          ? null
          : (current + delta + available.length) % available.length,
      ),
    [available.length],
  );
  const close = useCallback(() => {
    dialog.current?.close();
    setSelected(null);
    requestAnimationFrame(() => trigger.current?.focus());
  }, []);
  useEffect(() => {
    if (selectedItem && !dialog.current?.open) {
      dialog.current?.showModal();
      dialog.current
        ?.querySelector<HTMLButtonElement>(".viewer-close")
        ?.focus();
    }
    if (!selectedItem) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = before;
    };
  }, [selectedItem]);
  useEffect(() => {
    if (!selectedItem) return;
    const key = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        const focusable = dialog.current?.querySelectorAll<HTMLElement>(
          "button:not(:disabled),video[controls],a[href]",
        );
        if (focusable?.length) {
          const first = focusable[0],
            last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
      if (event.target instanceof HTMLVideoElement) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [selectedItem, move]);
  const hasVideo = items.some((item) =>
    ["video", "gif"].includes(item.sources[0]?.type),
  );
  return (
    <div className={`gallery ${featured ? "gallery-featured" : ""}`}>
      {hasVideo && (
        <div className="gallery-options">
          <button
            type="button"
            onClick={() => setPaused(!paused)}
            aria-pressed={paused}
          >
            {paused ? "Play" : "Pause"} previews{" "}
            <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>
          </button>
          <span>Muted previews · sound in viewer</span>
        </div>
      )}
      <div className="gallery-grid">
        {items.map((item, i) => (
          <figure
            className={`media-figure ${item.sources.length ? "has-media" : "awaiting-media"} ${item.id.endsWith("/mobile") ? "portrait-media" : ""}`}
            key={item.id}
          >
            {item.sources.length ? (
              <button
                type="button"
                className="media-open"
                onClick={(event) => {
                  trigger.current = event.currentTarget;
                  setSelected(available.findIndex((m) => m.id === item.id));
                }}
                aria-label={`Expand ${item.title}`}
              >
                <MediaPreview
                  item={item}
                  paused={paused}
                  priority={featured && i === 0}
                />
                <span className="expand-mark" aria-hidden="true">
                  ↗
                </span>
                <span className="media-kind">
                  {item.sources[0].type === "video"
                    ? "PLAY FILM"
                    : item.sources[0].type === "gif"
                      ? "VIEW ANIMATION"
                      : "EXPAND IMAGE"}
                </span>
              </button>
            ) : (
              <MediaPlaceholder item={item} />
            )}
            <figcaption>
              <span className="figure-no">
                {String(i + 1).padStart(2, "0")}
              </span>
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="media-dialog"
        aria-labelledby="viewer-title"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
      >
        {selectedItem && (
          <div className="viewer-shell">
            <div className="viewer-top">
              <span className="eyebrow">
                {selected! + 1} / {available.length}
              </span>
              <h2 id="viewer-title">{selectedItem.title}</h2>
              <button
                type="button"
                className="viewer-close"
                onClick={close}
                aria-label="Close media viewer"
              >
                Close <span aria-hidden="true">×</span>
              </button>
            </div>
            <div
              className="viewer-stage"
              onTouchStart={(e) => {
                touch.current = {
                  x: e.touches[0].clientX,
                  y: e.touches[0].clientY,
                };
              }}
              onTouchEnd={(e) => {
                if (!touch.current) return;
                const dx = e.changedTouches[0].clientX - touch.current.x,
                  dy = e.changedTouches[0].clientY - touch.current.y;
                if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy))
                  move(dx < 0 ? 1 : -1);
                touch.current = null;
              }}
            >
              {selectedItem.sources[0].type === "video" ? (
                <video
                  key={selectedItem.id}
                  controls
                  playsInline
                  preload="metadata"
                  poster={selectedItem.poster}
                >
                  {selectedItem.sources
                    .filter((s) => s.type === "video")
                    .map((s) => (
                      <source key={s.src} src={s.src} type={s.mime} />
                    ))}
                  Your browser does not support this video.
                </video>
              ) : (
                <img
                  key={selectedItem.id}
                  src={selectedItem.sources[0].src}
                  alt={selectedItem.title}
                  width={1600}
                  height={1000}
                />
              )}
            </div>
            <div className="viewer-bottom">
              <p aria-live="polite">{selectedItem.caption}</p>
              {available.length > 1 && (
                <div className="viewer-nav">
                  <button
                    type="button"
                    onClick={() => move(-1)}
                    aria-label="Previous media"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => move(1)}
                    aria-label="Next media"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
