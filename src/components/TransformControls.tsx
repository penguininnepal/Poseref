const TransformControls = ({ onRotate, onFlip, onScale }: any) => {
  return (
    <div className="absolute right-2 bottom-24 flex flex-col space-y-2">
      <button onClick={onRotate} className="bg-gray-700 text-white text-xs px-2 py-1 rounded">Rotate</button>
      <button onClick={onFlip} className="bg-gray-700 text-white text-xs px-2 py-1 rounded">Flip</button>
      <button onClick={onScale} className="bg-gray-700 text-white text-xs px-2 py-1 rounded">Scale</button>
    </div>
  );
};

export default TransformControls;
