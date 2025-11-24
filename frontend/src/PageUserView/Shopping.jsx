import "../output.css";
import Header from "../componentUserView/Header.jsx";
import Footer from "../componentUserView/Footer.jsx";
import BackgroundShopping from "../assets/img/backshopping.png";
import liveroutfit from "../assets/img/liveroutfit.png";
import homekit from "../assets/img/homekit.png";
export default function Shopping() {
  return (
    <>
      <Header />
      <div
        className="relative w-full h-screen bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `url(${BackgroundShopping})`,
        }}
      >
        {/* Overlay đỏ */}
        <div className="absolute inset-0 bg-red-900/40"></div>

        {/* CONTENT */}
        <div className="relative z-10 text-white w-full px-20 flex flex-col gap-4">
          {/* Title chạy dài toàn chiều ngang */}
          <h1
            className="text-center Prosto font-normal text-7xl leading-[1.875rem] tracking-[-0.12rem] text-[#FFF6F5]"
            style={{
              textShadow: "0px 0px 60px rgba(255, 255, 255, 0.9)",
              WebkitTextStrokeWidth: "1.2px",
              WebkitTextStrokeColor: "#FFF",
            }}
          >
            LIVERPOOL OFFICIAL SHOP
          </h1>

          {/* Subtitle – full width luôn */}
          <p className="font-inter font-normal text-xl text-[#D1D5DB] text-left Inter ml-34">
            Premium athletic gear designed for champions. Push your limits
            <br></br>
            with performance-driven equipment.
          </p>

          <button className="ml-34 mt-3 px-6 py-2 bg-[linear-gradient(180deg,#E01E1E_0%,#7A1010_100%)] hover:text-orange-400 cursor-pointer rounded-sm hover:scale-105 font-semibold w-[150px]">
            SHOP NOW
          </button>

          {/* Stats */}
          <div className="flex gap-16 mx-auto text-center text-white absolute top-90 left-[40%]">
            <div>
              <p className="text-3xl font-bold">20k+</p>
              <p className="text-sm opacity-80">Recent Items</p>
            </div>

            <div>
              <p className="text-3xl font-bold">4.9★</p>
              <p className="text-sm opacity-80">Average Rate</p>
            </div>

            <div>
              <p className="text-3xl font-bold">48hr</p>
              <p className="text-sm opacity-80">Fast Delivery</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-20 gap-30 mt-20 bg-[#A2010C]">
        <div className="flex items-left justify-center flex-col w-1/5 Kanit">
          <p className="text-white text-4xl font-bold">LIVERPOOL FC</p>
          <p className="text-white text-2xl font-bold">25/26 HOME KIT</p>
          <p className="text-[#D1D5DB] text-xs Inter w-50">
            Premium athletic gear designed for champions. Push your limits with
            performance-driven equipment.
          </p>
          <button className="w-30 h-10 hover:text-red-600 hover:shadow-2xl hover:scale-105 cursor-pointer bg-white mt-10">
            Buy Now
          </button>
        </div>
        <img src={liveroutfit} alt="img_1" className="w-1/4 h-120" />
        <img src={liveroutfit} alt="Img_2" className="w-1/4 h-120" />
      </div>
      <div className="flex flex-col items-center justify-center my-20 gap-20">
        <p className="font-bold text-3xl Kanit">OUR KIT COLLECTION</p>
        <div className="grid grid-cols-4 gap-10 mx-20 Kanit">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="bg-[#911B1E] py-7">
              <img src={homekit} alt="kit" />
            </div>
            <p className="font-bold text-xl">Home Kit</p>
            <button className="w-30 h-10 text-white font-bold  hover:shadow-2xl hover:scale-105 cursor-pointer bg-[#911B1E]">
              Buy Now
            </button>
          </div>
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="bg-[#AF8A60] py-7">
              <img src={homekit} alt="kit" />
            </div>
            <p className="font-bold text-xl">Home Kit</p>
            <button className="w-30 h-10 text-white font-bold  hover:shadow-2xl hover:scale-105 cursor-pointer bg-[#AF8A60]">
              Buy Now
            </button>
          </div>
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="bg-[#15595B] py-7">
              <img src={homekit} alt="kit" />
            </div>
            <p className="font-bold text-xl">Home Kit</p>
            <button className="w-30 h-10 text-white font-bold  hover:shadow-2xl hover:scale-105 cursor-pointer bg-[#15595B]">
              Buy Now
            </button>
          </div>
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="bg-[#282830E0] py-7">
              <img src={homekit} alt="kit" />
            </div>
            <p className="font-bold text-xl">Home Kit</p>
            <button className="w-30 h-10 text-white font-bold  hover:shadow-2xl hover:scale-105 cursor-pointer bg-[#282830E0]">
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
