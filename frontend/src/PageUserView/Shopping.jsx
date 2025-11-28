import "../output.css";
import Header from "../componentUserView/Header.jsx";
import Footer from "../componentUserView/Footer.jsx";
import BackgroundShopping from "../assets/img/backshopping.png";
import BG_1 from "../assets/img/Background_1.png";
import BG_2 from "../assets/img/Background_2.png";
import BG_3 from "../assets/img/Background_3.png";
import BG_4 from "../assets/img/Background_4.png";
import { useState, useEffect, useRef } from "react";
import tick from "../assets/img/tick.png";
import SvgStart from "../assets/svg/SvgStart.jsx";
import Avatar01 from "../assets/img/Avatar01.png";
import api from "../Api/apitoken.js"; // ✅ THÊM IMPORT API

export default function Shopping() {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const containerRef = useRef(null);
  const [shoesData, setShoesData] = useState({
    title: "",
    content: "",
  });
  const [miniShoes, setMiniShoes] = useState([]);
  // Intro Section
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [image5, setImage5] = useState(null);

  // Kit Collection
  const [kitList, setKitList] = useState([]);

  // Accessories
  const [accImages, setAccImages] = useState([]);

  // Ball Collection
  const [ballList, setBallList] = useState([]);

  useEffect(() => {
    const loadShoppingConfig = async () => {
      try {
        const res = await api.get("/api/admin/shoppingpage/config");
        const data = res.data.data;
        console.log("📥 Loaded config:", data);

        // INTRO SECTION
        setTitle(data.introTitle || "");
        setContent(data.introContent || "");
        const introImgs = data.introImages || [];
        setImage1(introImgs[0] || null);
        setImage2(introImgs[1] || null);
        const shoesImages = data.shoesImages || [];
        setImage3(shoesImages[0] || null);
        setImage4(shoesImages[1] || null);
        setImage5(shoesImages[2] || null);

        // KIT COLLECTION
        setKitList(
          (data.kits || []).map((kit) => ({
            name: kit.title || "",
            image: kit.image || null,
            bgColor: kit.bgColor || "#911B1E",
            hoverColor: kit.hoverColor || "hover:ring-red-600",
          }))
        );

        // ACCESSORIES
        setAccImages(data.accessories || []);

        // BALL COLLECTION
        setBallList(
          (data.balls || []).map((ball) => ({
            name: ball.title || "",
            image: ball.image || null,
          }))
        );

        // SHOES SECTION
        setShoesData({
          title: data.shoesTitle || "",
          content: data.shoesContent || "",
        });
        setMiniShoes(
          (data.shoesMiniTitles || []).map((mini) => ({
            main: mini.main || "",
            sub: mini.sub || null,
          }))
        );
        console.log("👟 Shoes Data:", shoesData);

        console.log("🎉 All config loaded successfully");
      } catch (err) {
        console.error("❌ Error loading config:", err);
        alert("Không thể tải dữ liệu!");
      }
    };

    loadShoppingConfig();
  }, []);

  // Auto scroll từ phải sang trái
  useEffect(() => {
    if (!autoScroll || isDragging) return;

    const interval = setInterval(() => {
      if (containerRef.current) {
        const container = containerRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;

        if (container.scrollLeft >= maxScroll) {
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += 1;
        }
      }
    }, 20);

    return () => clearInterval(interval);
  }, [autoScroll, isDragging]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setAutoScroll(false);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => setAutoScroll(true), 2000);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setTimeout(() => setAutoScroll(true), 2000);
    }
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setAutoScroll(false);
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTimeout(() => setAutoScroll(true), 2000);
  };

  return (
    <>
      <Header />

      {/* HERO SECTION */}
      <div
        className="relative w-full h-screen bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `url(${BackgroundShopping})`,
        }}
      >
        <div className="absolute inset-0 bg-red-900/40"></div>
        <div className="relative z-10 text-white w-full px-20 flex flex-col gap-4">
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
          <p className="font-inter font-normal text-xl text-[#D1D5DB] text-left Inter ml-34">
            Premium athletic gear designed for champions. Push your limits
            <br />
            with performance-driven equipment.
          </p>
          <button className="ml-34 mt-3 px-6 py-2 bg-[linear-gradient(180deg,#E01E1E_0%,#7A1010_100%)] hover:text-orange-400 cursor-pointer rounded-sm hover:scale-105 font-semibold w-[150px]">
            SHOP NOW
          </button>
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

      {/* INTRO SECTION */}
      <div className="flex items-center justify-center py-20 gap-30 mt-20 bg-[#A2010C]">
        <div className="flex items-left justify-center flex-col w-1/5 Kanit">
          <p className="text-white text-4xl font-bold">LIVERPOOL FC</p>
          <p className="text-white text-2xl font-bold">{title}</p>
          <p className="text-[#D1D5DB] text-xs Inter w-50">{content}</p>
          <button className="w-30 h-10 hover:text-red-600 hover:shadow-2xl hover:scale-105 cursor-pointer bg-white mt-10">
            Buy Now
          </button>
        </div>
        {image1 && <img src={image1} alt="img_1" className="w-1/4 h-120" />}
        {image2 && <img src={image2} alt="Img_2" className="w-1/4 h-120" />}
      </div>

      {/* KIT COLLECTION - FIXED LOGIC */}
      <div className="flex flex-col items-center justify-center my-20 gap-20">
        <p className="font-bold text-3xl Kanit">OUR KIT COLLECTION</p>
        <div className="grid grid-cols-4 gap-10 mx-20 Kanit">
          {kitList.map((kit, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-3"
            >
              <div
                className="py-7 flex items-center justify-center w-full"
                style={{ backgroundColor: kit.bgColor }}
              >
                <img src={kit.image} alt={kit.name} />
              </div>
              <p className="font-bold text-xl">{kit.name}</p>
              <button
                className={`w-30 h-10 text-white font-bold ${kit.hoverColor} hover:shadow-2xl hover:scale-105 cursor-pointer`}
                style={{ backgroundColor: kit.bgColor }}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div className="py-20 flex items-center justify-center gap-15 Geist">
        <div className="flex items-center justify-center gap-2 flex-col">
          <img src={BG_1} alt="Background" />
          <p className="text-lg font-bold">Free Shipping</p>
          <p className="text-sm text-[#636363]">On all orders over $75</p>
        </div>
        <div className="flex items-center justify-center gap-2 flex-col">
          <img src={BG_2} alt="Background" />
          <p className="text-lg font-bold">Performance Guaranteed</p>
          <p className="text-sm text-[#636363]">Pro-grade quality materials</p>
        </div>
        <div className="flex items-center justify-center gap-2 flex-col">
          <img src={BG_3} alt="Background" />
          <p className="text-lg font-bold">Easy Returns</p>
          <p className="text-sm text-[#636363]">30-day money back guarantee</p>
        </div>
        <div className="flex items-center justify-center gap-2 flex-col">
          <img src={BG_4} alt="Background" />
          <p className="text-lg font-bold">Fast Delivery</p>
          <p className="text-sm text-[#636363]">2-3 business days shipping</p>
        </div>
      </div>

      {/* ACCESSORIES CAROUSEL - FIXED LOGIC */}
      <div className="min-h-screen bg-white flex items-center justify-center flex-col p-4 mb-20">
        <div className="max-w-6xl w-full">
          <h1 className="text-5xl font-bold text-black Kanit text-center mb-8">
            OUR ACCESSORIES
          </h1>
          <div
            ref={containerRef}
            className={`overflow-x-auto scrollbar-hide ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              perspective: "1000px",
            }}
          >
            <div className="flex gap-8 w-max px-4 py-8">
              {[...accImages, ...accImages, ...accImages].map(
                (image, index) => {
                  const position = index % 4;
                  let translateZ = 0;

                  if (position === 0) {
                    translateZ = -50;
                  } else if (position === 1) {
                    translateZ = -20;
                  } else if (position === 2) {
                    translateZ = -20;
                  } else if (position === 3) {
                    translateZ = -50;
                  }

                  return (
                    <div
                      key={`acc-${index}`}
                      className="flex-shrink-0 w-82 h-110 overflow-hidden transition-all duration-300"
                      style={{
                        transform: `translateZ(${translateZ}px)`,
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <img
                        src={image}
                        alt={`Accessory ${index + 1}`}
                        className="w-full h-full object-cover pointer-events-none select-none"
                        draggable="false"
                      />
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
        <button className="w-60 h-10 hover:text-red-600 hover:shadow-2xl hover:scale-105 cursor-pointer bg-black text-white Inter font-bold mt-4">
          Shop Now
        </button>
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

      {/* BALL COLLECTION - FIXED LOGIC */}
      <div className="bg-black py-20 text-white Kanit flex items-center justify-center flex-col">
        <h1 className="text-6xl font-bold py-10 pb-50">OUR BALL COLLECTION</h1>
        <div className="flex items-center justify-center gap-35 font-bold">
          {ballList.map((ball, index) => (
            <div
              key={index}
              className="flex items-center justify-center flex-col gap-1 transition-all duration-500 
                hover:-translate-y-40 hover:shadow-[0_0_20px_#CB3131] rounded-2xl p-2"
            >
              <img src={ball.image} alt={ball.name} className="w-81 h-81" />
              <p className="text-xl">{ball.name}</p>
              <button className="w-30 h-10 hover:text-red-600 hover:shadow-2xl hover:scale-105 cursor-pointer bg-[linear-gradient(90deg,#CB3131_0%,#651818_100%)] text-white Inter font-bold">
                Shop Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SHOES SECTION */}
      <div className="bg-[#EBEBEB] py-30 my-40 flex items-center justify-center px-40 gap-30 Geist">
        <div className="w-1/2 flex flex-col gap-2">
          <p className="font-bold text-4xl">{shoesData.title}</p>
          <p className="text-[#636363] text-base">{shoesData.content}</p>
          {miniShoes.map((mini, index) => (
            <div key={index} className="flex text-left items-center gap-2">
              <img src={tick} alt="tick" className="w-6 h-6" />
              <div className="text-[#636363]">
                <p className="text-black font-bold">{mini.main}</p>
                <p className="text-xs">{mini.sub}</p>
              </div>
            </div>
          ))}
          ,
          <button className="w-40 h-10 rounded-lg hover:text-red-600 hover:shadow-2xl hover:scale-105 cursor-pointer bg-[#AD0000] text-white  font-bold flex items-center justify-center gap-5 group cursor-pointer">
            Shop Now
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="group-hover:animate-[blink_1s_ease-in-out_infinite]"
            >
              <path
                d="M3.33203 8H12.6654"
                stroke="#FCFCFC"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 3.33301L12.6667 7.99967L8 12.6663"
                stroke="#FCFCFC"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="flex items-center justify-center gap-10 w-1/2">
          <img src={image3} alt="shoes" className="w-90 h-90 shadow-xl/40" />
          <div className="flex items-center justify-center flex-col gap-10">
            <img src={image4} alt="shoes" className="shadow-xl/40 w-40 h-40" />
            <img src={image5} alt="shoes" className="shadow-xl/40 w-40 h-40" />
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className="py-20 flex items-center justify-center flex-col gap-10 mb-50">
        <h1 className="Inter font-bold text-4xl">WHAT OUR FANS SAY</h1>
        <div className="flex items-center justify-center gap-10 mx-50">
          <div className="flex flex-col border border-2 border-[#E01E1E] p-5 gap-3 rounded-lg">
            <div className="flex gap-3">
              <SvgStart fillSvg="none" fillPath="#E01E1E" />
              <SvgStart fillSvg="none" fillPath="#E01E1E" />
              <SvgStart fillSvg="none" fillPath="#E01E1E" />
              <SvgStart fillSvg="none" fillPath="#E01E1E" />
              <SvgStart fillSvg="none" fillPath="#E01E1E" />
            </div>
            <p className="Inter">
              "Best athletic gear I've ever used. The quality is outstanding and
              really helps me push harder during training."
            </p>
            <div className="flex items-center gap-3">
              <img src={Avatar01} alt="avt" className="h-10 w-10" />
              <div className="flex flex-col justify-center Inter">
                <p className="font-bold text-sm">Marcus Johnson</p>
                <p className="text-xs text-[#666666]">Professional Athlete</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col border border-2 border-[#E01E1E] p-5 gap-3 rounded-lg">
            <div className="flex gap-3">
              <SvgStart fillSvg="none" fillPath="#E01E1E" />
              <SvgStart fillSvg="none" fillPath="#E01E1E" />
              <SvgStart fillSvg="none" fillPath="#E01E1E" />
              <SvgStart fillSvg="none" fillPath="#E01E1E" />
              <SvgStart fillSvg="none" fillPath="#E01E1E" />
            </div>
            <p className="Inter">
              "Best athletic gear I've ever used. The quality is outstanding and
              really helps me push harder during training."
            </p>
            <div className="flex items-center gap-3">
              <img src={Avatar01} alt="avt" className="h-10 w-10" />
              <div className="flex flex-col justify-center Inter">
                <p className="font-bold text-sm">Marcus Johnson</p>
                <p className="text-xs text-[#666666]">Professional Athlete</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col border border-2 border-[#E01E1E] p-5 gap-3 rounded-lg">
            <div className="flex gap-3">
              <SvgStart fillSvg="none" fillPath="#E01E1E" />
              <SvgStart fillSvg="none" fillPath="#E01E1E" />
              <SvgStart fillSvg="none" fillPath="#E01E1E" />
              <SvgStart fillSvg="none" fillPath="#E01E1E" />
              <SvgStart fillSvg="none" fillPath="#E01E1E" />
            </div>
            <p className="Inter">
              "Best athletic gear I've ever used. The quality is outstanding and
              really helps me push harder during training."
            </p>
            <div className="flex items-center gap-3">
              <img src={Avatar01} alt="avt" className="h-10 w-10" />
              <div className="flex flex-col justify-center Inter">
                <p className="font-bold text-sm">Marcus Johnson</p>
                <p className="text-xs text-[#666666]">Professional Athlete</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
