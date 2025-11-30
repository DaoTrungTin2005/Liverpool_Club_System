import "../output.css";
import ball from "../assets/img/ball.png";
export default function ProductOrderCart(props) {
  return (
    <>
      <div className="flex items-center justify-center shadow-sm rounded-lg hover:shadow-2xl bg-white">
        <div className="flex items-center justify-center gap-70 p-5 relative">
          <div className="flex items-center justify-center gap-10">
            <img src={ball} alt="ball" className="w-20 h-20 rounded-xl" />
            <p className="absolute z-0 mr-18 mt-18 rounded-full bg-black font-black text-white w-6 h-6 text-center">
              12
            </p>
            <div className="flex flex-col gap-3 justify-center text-[#4B5563]">
              <h1 className="font-bold text-black">STRIKER ELITE</h1>
              <p className="text-sm">Size: 8</p>
              <p className="text-sm font-black" style={{ color: props.color }}>
                967000 VND
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <p className="font-black">120000 VND</p>
            <p className="text-xs text-[#4B5563]">x12</p>
          </div>
        </div>
      </div>
    </>
  );
}
