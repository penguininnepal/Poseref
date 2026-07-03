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
        className="relative rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-2xl text-white/90 transition hover:bg-white/15"
        aria-label="Add overlay image"
      >
        <span className="relative">
          📷<span className="absolute -bottom-1 -right-1 text-base">+</span>
        </span>
      </button>
    </>
  );
};

export default OverlayManager;
