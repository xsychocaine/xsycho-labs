"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { RecessedWell } from "@/components/console-ui";
import {
  absoluteTime,
  applyClipCap,
  clipLength,
  relativeTime,
  resolveClipBounds,
  type ClipBounds,
} from "@/lib/audio-clip-utils";
import {
  labelClass,
  labelDimClass,
  ledActive,
  transitionSmooth,
} from "@/lib/design-tokens";

const BAR_COUNT = 48;
const SKIP_SECONDS = 5;
const END_EPSILON = 0.04;

const STATIC_WAVEFORM = Array.from({ length: BAR_COUNT }, (_, i) =>
  Math.round(14 + Math.abs(Math.sin(i * 0.38)) * 86),
);

const DEFAULT_BOUNDS: ClipBounds = { start: 0, end: 0 };

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type StudioAudioDeckProps = {
  label: string;
  moduleId: string;
  src: string;
  variant?: "raw" | "processed";
  clipDurationSeconds?: number;
};

export function StudioAudioDeck({
  label,
  moduleId,
  src,
  variant = "raw",
  clipDurationSeconds,
}: StudioAudioDeckProps) {
  const inputId = useId();
  const audioRef = useRef<HTMLAudioElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef = useRef<number>(0);
  const freqDataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const clipBoundsRef = useRef<ClipBounds>(DEFAULT_BOUNDS);
  const boundsReadyRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [liveLevels, setLiveLevels] = useState<number[] | null>(null);
  const [scrubbing, setScrubbing] = useState(false);

  const accent =
    variant === "processed"
      ? "from-xs-accent-deep to-xs-accent-bright"
      : "from-[#2a2a32] to-white/35";

  const hasDuration = Number.isFinite(duration) && duration > 0;
  const progress = hasDuration ? Math.min(100, (current / duration) * 100) : 0;

  const applyBounds = useCallback((bounds: ClipBounds) => {
    const length = clipLength(bounds);
    if (length <= 0) return;

    clipBoundsRef.current = bounds;
    boundsReadyRef.current = true;
    setDuration(length);
    setReady(true);
    setError(false);

    const audio = audioRef.current;
    if (audio) {
      const relative = relativeTime(audio.currentTime, bounds);
      setCurrent(Math.min(relative, length));
    }
  }, []);

  const stopAtClipEnd = useCallback((audio: HTMLAudioElement) => {
    const bounds = clipBoundsRef.current;
    audio.pause();
    audio.currentTime = bounds.end;
    setCurrent(clipLength(bounds));
    setPlaying(false);
    setLiveLevels(null);
  }, []);

  const syncTime = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const bounds = clipBoundsRef.current;
    if (!boundsReadyRef.current || bounds.end <= bounds.start) return;

    if (audio.currentTime >= bounds.end - END_EPSILON) {
      stopAtClipEnd(audio);
      return;
    }

    if (audio.currentTime < bounds.start) {
      audio.currentTime = bounds.start;
    }

    setCurrent(relativeTime(audio.currentTime, bounds));
  }, [stopAtClipEnd]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setPlaying(false);
    setCurrent(0);
    setDuration(0);
    clipBoundsRef.current = DEFAULT_BOUNDS;
    boundsReadyRef.current = false;
    setReady(false);
    setError(false);
    setLiveLevels(null);

    let cancelled = false;

    void resolveClipBounds(src, clipDurationSeconds).then((bounds) => {
      if (cancelled) return;
      if (bounds) {
        applyBounds(bounds);
        return;
      }

      const onMeta = () => {
        if (cancelled || boundsReadyRef.current) return;
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
          applyBounds(
            applyClipCap({ start: 0, end: audio.duration }, clipDurationSeconds),
          );
        }
      };

      audio.addEventListener("loadedmetadata", onMeta, { once: true });
      audio.addEventListener("durationchange", onMeta, { once: true });
    });

    const onPlay = () => {
      const bounds = clipBoundsRef.current;
      if (boundsReadyRef.current && audio.currentTime < bounds.start) {
        audio.currentTime = bounds.start;
        setCurrent(0);
      }
      if (boundsReadyRef.current && audio.currentTime >= bounds.end - END_EPSILON) {
        audio.currentTime = bounds.start;
        setCurrent(0);
      }
      setPlaying(true);
    };

    const onPause = () => {
      setPlaying(false);
      setLiveLevels(null);
    };

    const onEnded = () => {
      if (audioRef.current) stopAtClipEnd(audioRef.current);
    };

    const onError = () => {
      setReady(false);
      setError(true);
      setPlaying(false);
      setLiveLevels(null);
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    audio.load();

    return () => {
      cancelled = true;
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", syncTime);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [src, syncTime, applyBounds, stopAtClipEnd, clipDurationSeconds]);

  const ensureAnalyser = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || sourceRef.current) return analyserRef.current;

    const ctx = audioCtxRef.current ?? new AudioContext();
    audioCtxRef.current = ctx;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.75;
    analyserRef.current = analyser;
    freqDataRef.current = new Uint8Array(analyser.frequencyBinCount);

    const source = ctx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(ctx.destination);
    sourceRef.current = source;

    return analyser;
  }, []);

  useEffect(() => {
    if (!playing || error) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const analyser = ensureAnalyser();
    if (!analyser || !freqDataRef.current) return;

    void audioCtxRef.current?.resume();

    const tick = () => {
      const audio = audioRef.current;
      const data = freqDataRef.current;
      if (!audio || !data) return;

      const bounds = clipBoundsRef.current;
      if (boundsReadyRef.current && audio.currentTime >= bounds.end - END_EPSILON) {
        stopAtClipEnd(audio);
        return;
      }

      analyser.getByteFrequencyData(data);

      const levels = Array.from({ length: BAR_COUNT }, (_, i) => {
        const idx = Math.floor((i / BAR_COUNT) * data.length);
        const value = data[idx] ?? 0;
        const shaped = STATIC_WAVEFORM[i] * (0.35 + (value / 255) * 0.85);
        return Math.round(Math.min(100, shaped));
      });

      setLiveLevels(levels);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, error, ensureAnalyser, stopAtClipEnd]);

  useEffect(
    () => () => {
      cancelAnimationFrame(rafRef.current);
      void audioCtxRef.current?.close();
    },
    [],
  );

  const seekRelative = (value: number) => {
    const audio = audioRef.current;
    if (!audio || error || !boundsReadyRef.current) return;

    const bounds = clipBoundsRef.current;
    const length = clipLength(bounds);
    const relative = Math.min(Math.max(0, value), length);
    audio.currentTime = absoluteTime(relative, bounds);
    setCurrent(relative);
  };

  const skip = (delta: number) => {
    if (!boundsReadyRef.current) return;
    const length = clipLength(clipBoundsRef.current);
    const step =
      length > 0 ? Math.min(SKIP_SECONDS, length / 3) : SKIP_SECONDS;
    seekRelative(current + (delta < 0 ? -step : step));
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio || error) return;
    if (audio.paused) void audio.play();
    else audio.pause();
  };

  const seekFromWaveform = (event: MouseEvent<HTMLDivElement>) => {
    const el = waveformRef.current;
    if (!el || error || !hasDuration) return;

    const rect = el.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    seekRelative(ratio * duration);
  };

  const transportBtnClass = `flex h-9 w-9 shrink-0 items-center justify-center rounded-[3px] border border-xs-border-control bg-gradient-to-b from-[#1c1c24] to-[#0c0c10] font-mono text-[0.55rem] text-white/70 shadow-[0_2px_0_#030303,inset_0_1px_0_rgba(255,255,255,0.07)] ${transitionSmooth} hover:border-xs-accent/35 hover:text-xs-accent-bright hover:shadow-[0_3px_0_#030303,0_0_16px_-6px_rgba(168,85,247,0.35)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40`;

  return (
    <RecessedWell className="p-4 sm:p-5">
      <audio ref={audioRef} src={src} preload="auto" />

      <div className="mb-3 flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-start gap-2.5">
          <span
            aria-hidden
            className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${transitionSmooth} ${
              playing
                ? `${ledActive} animate-pulse shadow-[0_0_12px_rgba(168,85,247,1)]`
                : ready
                  ? "bg-xs-accent/40"
                  : "bg-[#252530]"
            }`}
          />
          <div>
            <p className={labelDimClass}>{moduleId}</p>
            <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-white/70">
              {label}
            </p>
          </div>
        </div>
        <span
          className={`rounded-[2px] border px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-widest ${transitionSmooth} ${
            variant === "processed"
              ? playing
                ? "border-xs-accent-bright/60 bg-[#1e0a3a]/60 text-xs-accent-bright"
                : "border-xs-accent/40 bg-[#1e0a3a]/40 text-xs-accent-bright/90"
              : "border-white/10 bg-black/40 text-white/40"
          }`}
        >
          {playing ? "Playing" : variant === "processed" ? "Processed" : "Raw"}
        </span>
      </div>

      <div
        ref={waveformRef}
        role="slider"
        aria-label={`Seek ${label}`}
        aria-valuemin={0}
        aria-valuemax={hasDuration ? duration : 0}
        aria-valuenow={current}
        tabIndex={0}
        onClick={seekFromWaveform}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") skip(-SKIP_SECONDS);
          if (e.key === "ArrowRight") skip(SKIP_SECONDS);
          if (e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        className={`relative flex h-14 cursor-pointer items-end justify-center gap-[2px] border-b border-white/[0.04] pb-3 ${transitionSmooth} hover:opacity-95`}
      >
        {(liveLevels ?? STATIC_WAVEFORM).map((h, i) => {
          const barProgress = ((i + 0.5) / BAR_COUNT) * 100;
          const played = barProgress <= progress;
          const playhead =
            hasDuration &&
            Math.abs(barProgress - progress) < 100 / BAR_COUNT / 2;

          return (
            <div
              key={i}
              className={`relative w-[2px] rounded-[1px] bg-gradient-to-t ${accent} ${transitionSmooth} ${
                played ? "opacity-100" : "opacity-35"
              } ${playing && played ? "brightness-125" : ""}`}
              style={{
                height: `${h}%`,
                transform: playhead ? "scaleY(1.08)" : undefined,
              }}
            />
          );
        })}

        {hasDuration && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-px bg-xs-accent-bright/80 shadow-[0_0_8px_rgba(192,132,252,0.8)]"
            style={{ left: `${progress}%` }}
          />
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => skip(-SKIP_SECONDS)}
          disabled={error || !ready}
          aria-label={`Rewind ${SKIP_SECONDS} seconds`}
          className={transportBtnClass}
        >
          −{SKIP_SECONDS}
        </button>

        <button
          type="button"
          onClick={toggle}
          disabled={error}
          aria-label={playing ? `Pause ${label}` : `Play ${label}`}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[3px] border border-xs-border-control bg-gradient-to-b from-[#1c1c24] to-[#0c0c10] shadow-[0_2px_0_#030303,inset_0_1px_0_rgba(255,255,255,0.07)] ${transitionSmooth} hover:border-xs-accent/35 hover:shadow-[0_3px_0_#030303,0_0_16px_-6px_rgba(168,85,247,0.35)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40`}
        >
          {playing ? (
            <span className="flex gap-[3px]" aria-hidden>
              <span className="h-3 w-[3px] rounded-[1px] bg-xs-accent-bright" />
              <span className="h-3 w-[3px] rounded-[1px] bg-xs-accent-bright" />
            </span>
          ) : (
            <span
              className="ml-0.5 h-0 w-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-xs-accent-bright"
              aria-hidden
            />
          )}
        </button>

        <button
          type="button"
          onClick={() => skip(SKIP_SECONDS)}
          disabled={error || !ready}
          aria-label={`Fast forward ${SKIP_SECONDS} seconds`}
          className={transportBtnClass}
        >
          +{SKIP_SECONDS}
        </button>

        <div className="min-w-0 flex-1">
          <label htmlFor={inputId} className="sr-only">
            Seek {label}
          </label>
          <input
            id={inputId}
            type="range"
            min={0}
            max={hasDuration ? duration : 0}
            step={0.05}
            value={current}
            disabled={error || !ready}
            onPointerDown={() => setScrubbing(true)}
            onPointerUp={() => setScrubbing(false)}
            onPointerLeave={() => setScrubbing(false)}
            onInput={(e) => seekRelative(Number(e.currentTarget.value))}
            onChange={(e) => seekRelative(Number(e.target.value))}
            className="studio-scrubber w-full"
            style={{ ["--progress" as string]: `${progress}%` }}
          />
          <div className="mt-1.5 flex justify-between font-mono text-[0.6rem] tracking-wider text-white/35">
            <span className={scrubbing ? "text-xs-accent-bright/80" : ""}>
              {formatTime(current)}
            </span>
            <span>{formatTime(hasDuration ? duration : 0)}</span>
          </div>
        </div>
      </div>

      {error && (
        <p className={`mt-3 border-t border-white/[0.06] pt-3 ${labelClass} text-white/30`}>
          Demo clip loading soon. Add audio to{" "}
          <span className="text-xs-accent/60">{src}</span>
        </p>
      )}
    </RecessedWell>
  );
}
