import "../../output.css";

export default function AOptions({ onConfirm, onCancel }) {
  return (
    <>
      <div className="flex gap-5">
        <button
          className="text-sm text-[#4B4B4B] h-10 w-30 border-1 italic hover:bg-red-600 hover:text-white"
          onClick={onConfirm}
        >
          Yes, ok
        </button>

        <button
          className="text-sm text-[#4B4B4B] h-10 w-30 border-1 italic hover:bg-red-600 hover:text-white"
          onClick={onCancel}
        >
          No, cancel
        </button>
      </div>
    </>
  );
}
