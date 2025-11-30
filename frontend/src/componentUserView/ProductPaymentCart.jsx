import "../output.css";
import ball from "../assets/img/ball.png";
export default function ProductPaymentCart() {
  return (
    <>
      <div className="flex items-center justify-center shadow-sm rounded-lg hover:shadow-2xl">
        <div className="flex items-center justify-center gap-10 p-5">
          <img src={ball} alt="ball" className="w-20 h-20 rounded-xl" />
          <div className="flex flex-col gap-3 justify-center text-[#4B5563]">
            <h1 className="font-bold text-black">STRIKER ELITE</h1>
            <div className="flex items-center justify-center gap-10">
              <p className="text-sm">Size: 8</p>
              <p className="text-sm">Available: 100</p>
            </div>
          </div>
          <p className="bg-[linear-gradient(180deg,#EF4444_0%,#892727_100%)] bg-clip-text text-transparent font-black">
            120000 VND
          </p>
        </div>
      </div>
    </>
  );
}
