import "../output.css";
import ball from "../assets/img/ball.png";
export default function ProductBio() {
  return (
    <>
      <div className="rounded-lg flex flex-col shadow-xl pb-5 gap-5">
        <img src={ball} alt="ball" className="h-3/4" />
        <div className="flex items-center justify-center gap-14 px-3.5">
          <p className="font-bold text-lg">STRIKER ELITE</p>
          <p className="text-[#4B5563] text-xs">Size: 8</p>
        </div>
        <p className="text-left text-[#EF4444] font-bold px-3.5">189.000 VND</p>
        <button className="w-9/10 mx-auto h-10 rounded-md hover:shadow-2xl hover:scale-105 cursor-pointer bg-[linear-gradient(90deg,#EF4444_0%,#892727_100%)] text-white  font-bold flex items-center justify-center gap-5 group cursor-pointer">
          Add to Cart
        </button>
      </div>
    </>
  );
}
