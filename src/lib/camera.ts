// Shared camera-domain helpers: media model, persisted settings/gallery,
// shutter sound, and video mime-type detection.

export interface MediaItem {
  id: string;
  kind: "photo" | "video";
  src: string;
  poster?: string;
  duration?: number;
  createdAt: number;
}

export type CameraMode = "photo" | "video";

export const newMediaId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// ---------- Persisted camera settings (like a real camera app) ----------

export interface CameraSettings {
  flashMode: "off" | "auto" | "always";
  ratio: string;
  timerValue: number;
  showGrid: boolean;
  cameraType: "user" | "environment";
}

const SETTINGS_KEY = "poseref-settings-v1";

const DEFAULT_SETTINGS: CameraSettings = {
  flashMode: "off",
  ratio: "3/4",
  timerValue: 0,
  showGrid: false,
  cameraType: "environment",
};

export const loadSettings = (): CameraSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<CameraSettings>;
    return {
      flashMode:
        parsed.flashMode === "auto" || parsed.flashMode === "always" ? parsed.flashMode : "off",
      ratio: typeof parsed.ratio === "string" ? parsed.ratio : DEFAULT_SETTINGS.ratio,
      timerValue:
        typeof parsed.timerValue === "number" && parsed.timerValue >= 0
          ? parsed.timerValue
          : 0,
      showGrid: parsed.showGrid === true,
      cameraType: parsed.cameraType === "user" ? "user" : "environment",
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: CameraSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Storage full or unavailable — settings simply won't persist.
  }
};

// ---------- Persisted gallery (photos survive reloads, like a real camera roll) ----------

const GALLERY_KEY = "poseref-gallery-v1";
const MAX_STORED_PHOTOS = 30;

const downscalePhoto = (src: string, maxDim = 800, quality = 0.75): Promise<string> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(src);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch {
        resolve(src);
      }
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });

export const loadPersistedPhotos = (): MediaItem[] => {
  try {
    const raw = localStorage.getItem(GALLERY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { id?: string; src?: string; createdAt?: number }[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => typeof item?.src === "string" && item.src.startsWith("data:image"))
      .slice(0, MAX_STORED_PHOTOS)
      .map((item, i) => ({
        id: typeof item.id === "string" ? item.id : `restored-${i}`,
        kind: "photo" as const,
        src: item.src as string,
        createdAt: typeof item.createdAt === "number" ? item.createdAt : 0,
      }));
  } catch {
    return [];
  }
};

// Fire-and-forget: downscales and stores recent photos. Videos are session-only
// (object URLs don't survive reloads and blobs are too large for localStorage).
export const persistPhotos = (items: MediaItem[]): void => {
  const photos = items.filter((item) => item.kind === "photo").slice(0, MAX_STORED_PHOTOS);
  void (async () => {
    try {
      const stored = await Promise.all(
        photos.map(async (photo) => ({
          id: photo.id,
          src: await downscalePhoto(photo.src),
          createdAt: photo.createdAt,
        }))
      );
      localStorage.setItem(GALLERY_KEY, JSON.stringify(stored));
    } catch {
      // Quota exceeded or unavailable — keep photos in memory only.
    }
  })();
};

// ---------- Shutter sound (subtle, native-like click) ----------

let audioCtx: AudioContext | null = null;

export const playShutterClick = (): void => {
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    audioCtx ??= new Ctor();
    if (audioCtx.state === "suspended") void audioCtx.resume();
    const time = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(2200, time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.12, time + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.07);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + 0.08);
  } catch {
    // Audio unavailable — capture silently.
  }
};

// ---------- Video recording mime-type detection ----------

export const pickVideoMimeType = (): string | undefined => {
  try {
    if (typeof MediaRecorder === "undefined" || !MediaRecorder.isTypeSupported) return undefined;
    const candidates = [
      "video/mp4;codecs=avc1",
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
      "video/mp4",
    ];
    return candidates.find((mime) => MediaRecorder.isTypeSupported(mime));
  } catch {
    return undefined;
  }
};

export const formatDuration = (totalSeconds: number): string => {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

// ---------- Frame painting (shared by photo capture and video recording) ----------

export interface PaintOptions {
  /** Front sensor frames are mirrored — un-mirror so output matches the true scene. */
  front: boolean;
  /** Raw frame orientation doesn't match how the phone is held — rotate upright. */
  rotated: boolean;
  /** Digital zoom factor (>= 1). */
  zoom: number;
}

/**
 * Paints a camera frame onto a W×H canvas with "cover" semantics:
 * corrects sensor orientation, un-mirrors front-camera frames, and applies
 * digital zoom. This is what makes captures match the preview and fixes
 * upside-down portrait photos on phones that deliver unrotated frames.
 */
export const paintCover = (
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  video: HTMLVideoElement,
  vw: number,
  vh: number,
  opts: PaintOptions
): void => {
  const orientedW = opts.rotated ? vh : vw;
  const orientedH = opts.rotated ? vw : vh;
  const scale = Math.max(W / orientedW, H / orientedH) * Math.max(1, opts.zoom);
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.scale(scale, scale);
  if (opts.rotated) ctx.rotate(opts.front ? -Math.PI / 2 : Math.PI / 2);
  if (opts.front) ctx.scale(-1, 1);
  ctx.drawImage(video, -vw / 2, -vh / 2, vw, vh);
  ctx.restore();
};

export interface OverlaySpec {
  src: string;
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  size: number;
}

/** Composites pose-reference ghost overlays onto a capture canvas (WYSIWYG). */
export const paintOverlays = (
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  specs: OverlaySpec[],
  bitmaps: Map<string, HTMLImageElement>,
  opacity: number
): void => {
  if (specs.length === 0 || opacity <= 0) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, Math.max(0, opacity / 100));
  for (const spec of specs) {
    const img = bitmaps.get(spec.src);
    if (!img || !img.complete || img.naturalWidth === 0) continue;
    const cx = (spec.x / 100) * W;
    const cy = (spec.y / 100) * H;
    const w = (spec.size / 100) * W;
    const h = (spec.size / 100) * H;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((spec.rotation * Math.PI) / 180);
    ctx.scale(spec.scaleX, spec.scaleY);
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
  }
  ctx.restore();
};
