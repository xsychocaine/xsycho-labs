export type ClipBounds = {
  start: number;
  end: number;
};

const SILENCE_THRESHOLD = 0.012;
const WINDOW_SECONDS = 0.05;
const MIN_CLIP_SECONDS = 0.5;

function windowPeaks(buffer: AudioBuffer, windowSize: number) {
  const peaks: number[] = [];
  const channels = buffer.numberOfChannels;
  const length = buffer.length;

  for (let offset = 0; offset < length; offset += windowSize) {
    let peak = 0;
    const end = Math.min(offset + windowSize, length);

    for (let ch = 0; ch < channels; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = offset; i < end; i++) {
        const sample = Math.abs(data[i]);
        if (sample > peak) peak = sample;
      }
    }

    peaks.push(peak);
  }

  return peaks;
}

/** Trim leading/trailing silence so the timeline matches audible content. */
export function analyzeAudibleBounds(buffer: AudioBuffer): ClipBounds {
  const sampleRate = buffer.sampleRate;
  const windowSize = Math.max(1, Math.floor(sampleRate * WINDOW_SECONDS));
  const peaks = windowPeaks(buffer, windowSize);
  const fileDuration = buffer.duration;

  if (peaks.length === 0) {
    return { start: 0, end: fileDuration };
  }

  let firstAudible = peaks.findIndex((peak) => peak > SILENCE_THRESHOLD);
  if (firstAudible < 0) {
    return { start: 0, end: Math.min(fileDuration, MIN_CLIP_SECONDS) };
  }

  let lastAudible = peaks.length - 1;
  for (let i = peaks.length - 1; i >= 0; i--) {
    if (peaks[i] > SILENCE_THRESHOLD) {
      lastAudible = i;
      break;
    }
  }

  const start = (firstAudible * windowSize) / sampleRate;
  const end = Math.min(
    fileDuration,
    ((lastAudible + 1) * windowSize) / sampleRate,
  );

  return {
    start,
    end: Math.max(end, start + MIN_CLIP_SECONDS),
  };
}

export function applyClipCap(bounds: ClipBounds, maxSeconds?: number): ClipBounds {
  if (!maxSeconds || maxSeconds <= 0) return bounds;

  const cappedEnd = Math.min(bounds.end, bounds.start + maxSeconds);
  return {
    start: bounds.start,
    end: Math.max(cappedEnd, bounds.start + MIN_CLIP_SECONDS),
  };
}

export async function resolveClipBounds(
  src: string,
  maxSeconds?: number,
): Promise<ClipBounds | null> {
  try {
    const response = await fetch(src);
    if (!response.ok) return null;

    const buffer = await response.arrayBuffer();
    const ctx = new AudioContext();
    try {
      const decoded = await ctx.decodeAudioData(buffer.slice(0));
      return applyClipCap(analyzeAudibleBounds(decoded), maxSeconds);
    } finally {
      await ctx.close();
    }
  } catch {
    return null;
  }
}

export function clipLength(bounds: ClipBounds) {
  return Math.max(0, bounds.end - bounds.start);
}

export function clampToClip(time: number, bounds: ClipBounds) {
  return Math.min(Math.max(time, bounds.start), bounds.end);
}

export function relativeTime(time: number, bounds: ClipBounds) {
  return Math.max(0, time - bounds.start);
}

export function absoluteTime(relative: number, bounds: ClipBounds) {
  return clampToClip(bounds.start + relative, bounds);
}
