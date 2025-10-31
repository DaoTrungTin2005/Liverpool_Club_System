import "../output.css";

export default function BackgroundPlayer({
  img,
  alt,
  namePlayer,
  numberPlayer,
}) {
  return (
    <div className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden">
      <img
        src={img}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover brightness-50 hue-rotate-15 top-20"
      />

      <div className="absolute inset-0 pointer-events-none"></div>

      <div className="relative z-10 px-6 top-30">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-widest uppercase text-transparent [-webkit-text-stroke:3px_white] [text-stroke:3px_white] drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] [text-shadow:0_0_40px_rgba(255,0,0,0.6),0_0_60px_rgba(255,0,0,0.4)]">
          {namePlayer}
        </h1>
        <p className="text-7xl md:text-9xl font-bold text-white mt-4 [text-shadow:0_0_30px_rgba(255,255,255,0.9),0_0_60px_rgba(200,0,0,0.8)]">
          {numberPlayer}
        </p>
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      </div>
    </div>
  );
}
