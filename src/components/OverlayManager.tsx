import { useRef } from "react";

interface OverlayManagerProps {
  onAddOverlay: (src: string) => void;
}

const OverlayManager: React.FC<OverlayManagerProps> = ({ onAddOverlay }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        onAddOverlay(src);
      };
      reader.readAsDataURL(file);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload overlay image"
      />
      <button
        onClick={openFilePicker}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-base text-white/90 transition hover:bg-white/15 active:scale-95"
        aria-label="Add overlay image"
        title="Choose a pose reference — replaces the current one"
      >
        <span className="relative leading-none">
          🖼<span className="absolute -bottom-1 -right-1.5 text-[11px] font-bold">+</span>
        </span>
      </button>
    </>
  );
};

export default OverlayManager;
