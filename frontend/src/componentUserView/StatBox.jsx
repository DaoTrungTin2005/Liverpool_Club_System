import "../output.css";
export default function StatBox({ label, value, img, big = false }) {
  return (
    <div className="flex flex-col items-center justify-center">
      {img && <img src={img} alt={label} className="h-10 mb-2 opacity-80" />}
      <span className="text-3xl text-white font-bold whitespace-nowrap">
        {label}
      </span>
      <span
        className={`font-bold transition-all ${
          big
            ? "text-5xl md:text-6xl text-red-500"
            : "text-3xl md:text-4xl text-red-400"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
