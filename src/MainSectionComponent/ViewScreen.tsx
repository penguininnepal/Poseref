import { useState, useRef, useEffect, useCallback } from "react";
import ZoomControl from "../components/ZoomControl";
import {
  paintCover,
  paintOverlays,
  pickVideoMimeType,
  playShutterClick,
  formatDuration,
  type CameraMode,
  type OverlaySpec,
} from "../lib/camera";

interface Overlay {
  id: string;
  src: string;
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  size: number;
}

interface ViewScreenProps {
  flashMode: "off" | "auto" | "always";
  ratio: string;
  timerValue: number;
  cameraType: "user" | "environment";
  mode: CameraMode;
  onPhotoCaptured: (photo: string) => void;
  onVideoCaptured: (src: string, duration: number, poster: string) => void;
  overlays?: Overlay[];
  overlayOpacity?: number;
  onUpdateOverlay?: (id: string, updates: Partial<Overlay>) => void;
  showGrid?: boolean;
  onReadyChange?: (ready: boolean) => void;
  onRecordingChange?: (recording: boolean) => void;
}

interface FocusPoint {
  x: number;
  y: number;
  key: number;
}

interface ExtendedCapabilities extends MediaTrackCapabilities {
  torch?: boolean;
  focusMode?: string[];
}

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const even = (n: number): number => Math.max(2, Math.floor(n / 2) * 2);

const ViewScreen: React.FC<ViewScreenProps> = ({
  flashMode,
  ratio,
  timerValue,
  cameraType,
  mode,
  onPhotoCaptured,
  onVideoCaptured,
  overlays = [],
  overlayOpacity = 100,
  onUpdateOverlay,
  showGrid = false,
  onReadyChange,
  onRecordingChange,
}) => {
  const [zoom, setZoom] = useState(1);
  const [showFrontGlow, setShowFrontGlow] = useState(false);
  const [rearFlash, setRearFlash] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [draggingOverlayId, setDraggingOverlayId] = useState<string | null>(null);
  const [pinchDistance, setPinchDistance] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [torchSupported, setTorchSupported] = useState(false);
  const [focusPoint, setFocusPoint] = useState<FocusPoint | null>(null);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestIdRef = useRef(0);
  const zoomRef = useRef(zoom);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const rafRef = useRef(0);
  const micStreamRef = useRef<MediaStream | null>(null);
  const elapsedTimerRef = useRef<number | null>(null);
  const recordStartRef = useRef(0);
  const overlayBitmapsRef = useRef(new Map<string, HTMLImageElement>());

  const isFront = cameraType === "user";
  zoomRef.current = zoom;

  useEffect(() => {
    onReadyChange?.(cameraReady);
  }, [cameraReady, onReadyChange]);

  useEffect(() => {
    onRecordingChange?.(recording);
  }, [recording, onRecordingChange]);

  // Keep decoded overlay images ready for compositing into captures/recordings.
  useEffect(() => {
    const map = overlayBitmapsRef.current;
    const seen = new Set<string>();
    overlays.forEach((overlay) => {
      seen.add(overlay.src);
      if (!map.has(overlay.src)) {
        const img = new Image();
        img.src = overlay.src;
        map.set(overlay.src, img);
      }
    });
    Array.from(map.keys()).forEach((key) => {
      if (!seen.has(key)) map.delete(key);
    });
  }, [overlays]);

  const overlaySpecs = (): OverlaySpec[] =>
    overlays.map((o) => ({
      src: o.src,
      x: o.x,
      y: o.y,
      rotation: o.rotation,
      scaleX: o.scaleX,
      scaleY: o.scaleY,
      size: o.size,
    }));

  const getVideoTrack = (): MediaStreamTrack | null =>
    streamRef.current?.getVideoTracks()[0] ?? null;

  const setTorch = useCallback(async (on: boolean): Promise<boolean> => {
    try {
      const track = streamRef.current?.getVideoTracks()[0];
      const caps = track?.getCapabilities?.() as unknown as ExtendedCapabilities | undefined;
      if (!track || caps?.torch !== true) return false;
      await track.applyConstraints({
        advanced: [{ torch: on } as unknown as MediaTrackConstraintSet],
      });
      return true;
    } catch {
      return false;
    }
  }, []);

  // Rear "always on" flash = torch, like a real phone camera.
  useEffect(() => {
    if (!cameraReady) return;
    if (cameraType === "environment" && flashMode === "always") {
      void setTorch(true);
      return () => {
        void setTorch(false);
      };
    }
    void setTorch(false);
  }, [cameraType, flashMode, cameraReady, setTorch]);

  const getPinchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const touch0 = touches[0];
    const touch1 = touches[1];
    const dx = touch0.clientX - touch1.clientX;
    const dy = touch0.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent, overlayId: string) => {
    if (e.touches.length === 1) {
      setDraggingOverlayId(overlayId);
    } else if (e.touches.length === 2) {
      setPinchDistance(getPinchDistance(e.touches));
    }
  };

  const handleTouchMove = (e: React.TouchEvent, overlayId: string) => {
    if (!screenRef.current || !onUpdateOverlay) return;

    const overlay = overlays.find((o) => o.id === overlayId);
    if (!overlay) return;

    const rect = screenRef.current.getBoundingClientRect();

    if (e.touches.length === 1 && draggingOverlayId === overlayId) {
      const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
      const y = ((e.touches[0].clientY - rect.top) / rect.height) * 100;
      onUpdateOverlay(overlayId, { x, y });
    } else if (e.touches.length === 2) {
      const newPinchDistance = getPinchDistance(e.touches);
      if (pinchDistance > 0) {
        const scale = newPinchDistance / pinchDistance;
        const newSize = Math.max(20, Math.min(200, overlay.size * scale));
        onUpdateOverlay(overlayId, { size: newSize });
        setPinchDistance(newPinchDistance);
      }
    }
  };

  const handleTouchEnd = () => {
    setDraggingOverlayId(null);
    setPinchDistance(0);
  };

  // Tap-to-focus, like a native camera: focus ring UI always shows, and the
  // lens is driven to single-shot focus wherever the hardware allows it.
  const lockFocus = async (): Promise<void> => {
    try {
      const track = getVideoTrack();
      const caps = track?.getCapabilities?.() as unknown as ExtendedCapabilities | undefined;
      if (!track || !caps?.focusMode) return;
      if (caps.focusMode.includes("single-shot")) {
        await track.applyConstraints({
          advanced: [{ focusMode: "single-shot" } as unknown as MediaTrackConstraintSet],
        });
      } else if (caps.focusMode.includes("continuous")) {
        await track.applyConstraints({
          advanced: [{ focusMode: "continuous" } as unknown as MediaTrackConstraintSet],
        });
      }
    } catch {
      // Focus control unsupported — the ring UI still confirms the tap.
    }
  };

  const handleViewfinderClick = (e: React.MouseEvent): void => {
    if (recording) return;
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("[data-overlay]")) return;
    const rect = screenRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const key = Date.now();
    setFocusPoint({ x, y, key });
    void lockFocus();
    window.setTimeout(() => {
      setFocusPoint((current) => (current?.key === key ? null : current));
    }, 1300);
  };

  const stopActiveStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const describeError = (err: unknown): string => {
    if (err instanceof DOMException || err instanceof Error) {
      if (err.name === "NotAllowedError" || err.name === "SecurityError") {
        return "Camera permission denied. Allow camera access in the browser site settings, then retry.";
      }
      if (err.name === "NotFoundError" || err.name === "OverconstrainedError") {
        return "This camera was not found on your device. Try the other camera.";
      }
      if (err.name === "NotReadableError") {
        return "Camera is busy (another app may be using it). Close other camera apps and retry.";
      }
    }
    return "Could not start the camera. Open this page over HTTPS in Chrome or Safari, then retry.";
  };

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    let cancelled = false;

    const start = async () => {
      // Always release the previous camera before opening a new one —
      // otherwise front/back switching keeps stale tracks alive and the
      // new stream fails or shows a frozen frame.
      stopActiveStream();
      if (cancelled) return;
      setCameraError(null);
      setCameraReady(false);
      setTorchSupported(false);

      // facingMode as a bare string is only a preference; many Android
      // phones need the exact constraint for the rear camera, and some
      // devices reject ideal resolutions — so try strict first, then loose.
      const attempts: MediaStreamConstraints[] = [
        {
          video: {
            facingMode: { exact: cameraType },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        },
        {
          video: { facingMode: cameraType, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        },
        { video: true, audio: false },
      ];

      let lastError: unknown = null;
      for (const constraints of attempts) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          if (cancelled || requestId !== requestIdRef.current) {
            stream.getTracks().forEach((track) => track.stop());
            return;
          }
          streamRef.current = stream;
          const track = stream.getVideoTracks()[0];
          const caps = track?.getCapabilities?.() as unknown as
            | ExtendedCapabilities
            | undefined;
          if (!cancelled && requestId === requestIdRef.current) {
            setTorchSupported(caps?.torch === true);
          }
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            // muted + explicit play() are required for autoplay on iOS Safari.
            videoRef.current.muted = true;
            await videoRef.current.play().catch(() => {});
          }
          if (!cancelled && requestId === requestIdRef.current) setCameraReady(true);
          return;
        } catch (err) {
          lastError = err;
          // Permission denial will fail every attempt — stop early.
          if (
            err instanceof DOMException &&
            (err.name === "NotAllowedError" || err.name === "SecurityError")
          ) {
            break;
          }
        }
      }

      if (!cancelled && requestId === requestIdRef.current) {
        console.error("Camera failed:", lastError);
        setCameraError(describeError(lastError));
      }
    };

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "This browser does not support camera access. Open this page in Chrome or Safari over HTTPS."
      );
      return;
    }
    start();

    return () => {
      cancelled = true;
      stopActiveStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraType, retryKey]);

  const cropDims = (
    vw: number,
    vh: number,
    rotated: boolean
  ): { cw: number; ch: number } => {
    const orientedW = rotated ? vh : vw;
    const orientedH = rotated ? vw : vh;
    const effectiveRatio = ratio === "full" ? "9/16" : ratio;
    const [w, h] = effectiveRatio.split("/").map(Number);
    const targetRatio = w / h;
    let cw = orientedW;
    let ch = orientedH;
    if (cw / ch > targetRatio) {
      cw = ch * targetRatio;
    } else {
      ch = cw / targetRatio;
    }
    return { cw, ch };
  };

  const frameOrientation = (
    vw: number,
    vh: number
  ): { front: boolean; rotated: boolean } => {
    // Some phones deliver a landscape sensor frame while held in portrait
    // (or vice versa), which used to save upside-down/sideways photos.
    // Rotate only on a genuine orientation mismatch so devices that already
    // report correctly oriented frames are left untouched.
    const portraitUI = window.innerHeight >= window.innerWidth;
    const portraitFrame = vh >= vw;
    return { front: cameraType === "user", rotated: portraitUI !== portraitFrame };
  };

  const handleCapture = (): void => {
    if (!cameraReady || recording) {
      console.log("Capture ignored — camera not ready");
      return;
    }
    console.log("Capture button pressed");
    if (timerValue > 0) {
      setCountdown(timerValue);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev && prev > 1) {
            return prev - 1;
          }
          clearInterval(interval);
          setCountdown(null);
          void doCapture();
          return null;
        });
      }, 1000);
    } else {
      void doCapture();
    }
  };

  const doCapture = async (): Promise<void> => {
    console.log("Performing capture", { flashMode, cameraType, ratio, zoom });
    if (!videoRef.current) return;
    const video = videoRef.current;
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh) return;

    playShutterClick();

    // Rear flash behaves like a real phone: torch burst when supported,
    // otherwise a white screen flash. Front uses the screen glow.
    let torchOn = false;
    if (cameraType === "environment" && flashMode !== "off") {
      if (flashMode === "auto") {
        torchOn = await setTorch(true);
        if (torchOn) {
          await delay(350);
        } else {
          setRearFlash(true);
          window.setTimeout(() => setRearFlash(false), 550);
        }
      }
    }
    if (cameraType === "user" && flashMode === "auto") {
      setShowFrontGlow(true);
      setTimeout(() => setShowFrontGlow(false), 600);
    }

    const { front, rotated } = frameOrientation(vw, vh);
    const { cw, ch } = cropDims(vw, vh, rotated);

    const out = document.createElement("canvas");
    out.width = Math.round(cw);
    out.height = Math.round(ch);
    const ctx = out.getContext("2d");
    if (ctx) {
      paintCover(ctx, out.width, out.height, video, vw, vh, {
        front,
        rotated,
        zoom: zoomRef.current,
      });
      paintOverlays(ctx, out.width, out.height, overlaySpecs(), overlayBitmapsRef.current, overlayOpacity);
      const imageData = out.toDataURL("image/png");
      console.log("Captured image data created");
      onPhotoCaptured(imageData);
    }

    if (torchOn && flashMode !== "always") {
      await setTorch(false);
    }
  };

  // ---------- Video recording (canvas-composited, WYSIWYG) ----------

  const stopMic = () => {
    micStreamRef.current?.getTracks().forEach((track) => track.stop());
    micStreamRef.current = null;
  };

  const teardownRecording = (discard: boolean) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    if (elapsedTimerRef.current) {
      window.clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
    const rec = recorderRef.current;
    recorderRef.current = null;
    setRecording(false);
    if (rec && rec.state !== "inactive") {
      if (discard) {
        rec.ondataavailable = null;
        rec.onstop = null;
        try {
          rec.stop();
        } catch {
          // ignore
        }
        stopMic();
      } else {
        try {
          rec.stop();
        } catch {
          stopMic();
        }
      }
    } else {
      stopMic();
    }
  };

  const startRecording = async (): Promise<void> => {
    if (!cameraReady || !videoRef.current || recording) return;
    if (typeof MediaRecorder === "undefined" || !HTMLCanvasElement.prototype.captureStream) {
      setCameraError("Video recording is not supported in this browser. Try Chrome or Safari.");
      return;
    }
    const video = videoRef.current;
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh) return;

    const { front, rotated } = frameOrientation(vw, vh);
    const { cw, ch } = cropDims(vw, vh, rotated);
    const scale = Math.min(1, 720 / cw);
    const W = even(cw * scale);
    const H = even(ch * scale);

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Microphone for sound — recording continues silently if denied.
    let mic: MediaStream | null = null;
    try {
      mic = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = mic;
    } catch {
      mic = null;
    }

    const output = canvas.captureStream(30);
    mic?.getAudioTracks().forEach((track) => output.addTrack(track));

    const mime = pickVideoMimeType();
    let rec: MediaRecorder;
    try {
      rec =
        mime !== undefined
          ? new MediaRecorder(output, { mimeType: mime, videoBitsPerSecond: 6_000_000 })
          : new MediaRecorder(output);
    } catch {
      stopMic();
      setCameraError("Could not start the video recorder in this browser.");
      return;
    }

    chunksRef.current = [];
    rec.ondataavailable = (event: BlobEvent) => {
      if (event.data && event.data.size > 0) chunksRef.current.push(event.data);
    };
    rec.onstop = () => {
      const type = rec.mimeType || "video/webm";
      const blob = new Blob(chunksRef.current, { type });
      chunksRef.current = [];
      stopMic();
      if (blob.size > 0) {
        const url = URL.createObjectURL(blob);
        const poster = canvas.toDataURL("image/jpeg", 0.7);
        const duration = Math.max(1, Math.round((Date.now() - recordStartRef.current) / 1000));
        onVideoCaptured(url, duration, poster);
      }
    };

    recorderRef.current = rec;
    recordStartRef.current = Date.now();
    setElapsed(0);
    elapsedTimerRef.current = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - recordStartRef.current) / 1000));
    }, 500);

    const specs = overlaySpecs();
    const bitmaps = overlayBitmapsRef.current;
    const loop = () => {
      paintCover(ctx, W, H, video, vw, vh, { front, rotated, zoom: zoomRef.current });
      paintOverlays(ctx, W, H, specs, bitmaps, overlayOpacity);
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();

    try {
      rec.start(250);
    } catch {
      teardownRecording(true);
      return;
    }
    playShutterClick();
    setRecording(true);
  };

  const stopRecording = () => teardownRecording(false);

  const toggleRecording = () => {
    if (!cameraReady) return;
    if (recording) {
      playShutterClick();
      stopRecording();
    } else {
      void startRecording();
    }
  };

  const handleShutterTrigger = () => {
    if (mode === "photo") handleCapture();
    else toggleRecording();
  };

  // Never keep recording across camera/mode switches or unmount.
  useEffect(() => {
    if (mode !== "video" && recording) teardownRecording(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);
  useEffect(() => {
    return () => teardownRecording(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={screenRef}
      onClick={handleViewfinderClick}
      className="relative z-10 flex-1 overflow-hidden bg-black touch-none"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_55%)]" />
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        disablePictureInPicture
        className="h-full w-full object-cover"
        // Mirror the selfie preview like a native front camera; the saved
        // photo/video is un-mirrored in paintCover. Rear is never mirrored.
        style={{ transform: `scale(${zoom}) scaleX(${isFront ? -1 : 1})` }}
      />

      {/* Overlays */}
      {overlays.map((overlay) => (
        <img
          key={overlay.id}
          data-overlay
          src={overlay.src}
          alt="Overlay"
          onTouchStart={(e) => handleTouchStart(e, overlay.id)}
          onTouchMove={(e) => handleTouchMove(e, overlay.id)}
          onTouchEnd={handleTouchEnd}
          className="absolute cursor-move select-none"
          style={{
            left: `${overlay.x}%`,
            top: `${overlay.y}%`,
            transform: `translate(-50%, -50%) rotate(${overlay.rotation}deg) scaleX(${overlay.scaleX}) scaleY(${overlay.scaleY})`,
            opacity: overlayOpacity / 100,
            width: `${overlay.size}%`,
            height: `${overlay.size}%`,
            objectFit: "contain",
            touchAction: "none",
          }}
        />
      ))}

      <div className="absolute inset-x-0 top-4 flex justify-center px-4">
        {recording ? (
          <div className="flex items-center gap-2 rounded-full border border-red-500/40 bg-black/60 px-3 py-1.5 backdrop-blur-md">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
            <span className="text-[13px] font-semibold tabular-nums text-white">
              {formatDuration(elapsed)}
            </span>
          </div>
        ) : (
          <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-white/80 backdrop-blur-md">
            {cameraType === "user" ? "Selfie" : "Rear"}
            {torchSupported && cameraType === "environment" && flashMode !== "off" && (
              <span className="ml-2 text-yellow-400">⚡</span>
            )}
          </div>
        )}
      </div>

      {/* Tap-to-focus ring */}
      {focusPoint && (
        <div
          key={focusPoint.key}
          className="animate-focusRing pointer-events-none absolute z-30 h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 border-2 border-yellow-400"
          style={{ left: `${focusPoint.x}%`, top: `${focusPoint.y}%` }}
        />
      )}

      {/* Composition grid (rule of thirds) */}
      {showGrid && (
        <div className="pointer-events-none absolute inset-0 z-30">
          <div className="absolute inset-y-0 left-1/3 w-px bg-white/40" />
          <div className="absolute inset-y-0 left-2/3 w-px bg-white/40" />
          <div className="absolute inset-x-0 top-1/3 h-px bg-white/40" />
          <div className="absolute inset-x-0 top-2/3 h-px bg-white/40" />
        </div>
      )}

      {/* Camera starting / failed states — previously this was a silent black screen */}
      {!cameraReady && !cameraError && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60">
          <div className="rounded-full bg-black/60 px-4 py-2 text-xs font-medium tracking-wide text-white/80 backdrop-blur-md">
            Starting {isFront ? "front" : "rear"} camera…
          </div>
        </div>
      )}
      {cameraError && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/85 px-6">
          <div className="text-center">
            <div className="text-4xl">📷</div>
            <p className="mt-2 text-sm font-semibold text-white">Camera unavailable</p>
            <p className="mx-auto mt-1 max-w-[260px] text-xs leading-relaxed text-white/60">
              {cameraError}
            </p>
            <button
              onClick={() => setRetryKey((k) => k + 1)}
              className="mt-3 rounded-full bg-white px-5 py-2 text-[13px] font-bold text-black transition active:scale-95"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {countdown !== null && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <span className="rounded-3xl bg-white/90 px-6 py-4 text-6xl font-semibold text-black shadow-2xl">
            {countdown}
          </span>
        </div>
      )}

      {(cameraType === "user" && (flashMode === "always" || showFrontGlow)) || rearFlash ? (
        <div className="pointer-events-none absolute inset-0 z-40 animate-flashGlow">
          <div className="h-full w-full bg-white/35" />
        </div>
      ) : null}

      {!recording && (
        <div className="absolute inset-x-0 bottom-3 z-40 flex justify-center px-4">
          <ZoomControl zoom={zoom} onChange={setZoom} />
        </div>
      )}

      <button onClick={handleShutterTrigger} className="hidden" id="hiddenCaptureTrigger" />
    </div>
  );
};

export default ViewScreen;
