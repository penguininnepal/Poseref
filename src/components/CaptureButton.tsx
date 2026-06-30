const CaptureButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="relative bg-gradient-to-b from-white to-gray-200 h-20 w-20 rounded-full shadow-xl cursor-pointer active:scale-95 transition-transform flex items-center justify-center"
    >
      <div className="bg-gray-400 h-12 w-12 rounded-full shadow-inner"></div>
      <div className="absolute inset-0 rounded-full border-4 border-gray-500 opacity-70"></div>
      <div className="absolute top-2 left-2 h-16 w-16 rounded-full border border-white opacity-40"></div>
    </div>
  );
};

export default CaptureButton;
