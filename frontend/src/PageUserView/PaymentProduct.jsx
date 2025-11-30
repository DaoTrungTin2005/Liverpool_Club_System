import "../output.css";
import paymentbg from "../assets/img/paymentbg.png";
import Header from "../componentUserView/Header";
import Footer from "../componentUserView/Footer";
import ProductPaymentCart from "../componentUserView/ProductPaymentCart.jsx";
import user from "../assets/img/user.png";
import phone from "../assets/img/phone.png";
import email from "../assets/img/mail.png";
import address from "../assets/img/address.png";
import comment from "../assets/img/comment.png";
import Zalo from "../assets/img/Zalo.png";
import VNpay from "../assets/img/vnpay.png";
import Momo from "../assets/img/momo.png";
import { useState } from "react";
export default function PaymentProduct() {
  const [selectedMethod, setSelectedMethod] = useState(null);

  const paymentMethods = [
    {
      id: "zalopay",
      name: "ZALO PAY",
      logo: Zalo,
      color: {
        primary: "#0068FF",
        hover: "#0052CC",
        light: "#E6F0FF",
        ring: "#0068FF",
      },
    },
    {
      id: "vnpay",
      name: "VNPAY PAY",
      logo: VNpay,
      color: {
        primary: "#EF4444",
        hover: "#DC2626",
        light: "#FEE2E2",
        ring: "#EF4444",
      },
    },
    {
      id: "momo",
      name: "MOMO",
      logo: Momo,
      color: {
        primary: "#A50064",
        hover: "#8B0054",
        light: "#FCE7F3",
        ring: "#A50064",
      },
    },
  ];
  return (
    <>
      <Header />
      <div
        className="w-full h-70 mt-20 mb-30 flex items-center justify-center"
        style={{
          backgroundImage: `url(${paymentbg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-7xl text-white font-bold Tiro">
          PAYMENT CONFIRMATION
        </h1>
      </div>
      <div className="flex items-center justify-center gap-10">
        <div className="flex items-center justify-center flex-col gap-10 sticky self-start pt-10">
          <h2 className="text-[#C12F2F] font-black text-xl">YOUR ORDERS</h2>
          <div className="flex flex-col items-center justify-center gap-5">
            <ProductPaymentCart />
            <ProductPaymentCart />
            <ProductPaymentCart />
            <ProductPaymentCart />
            <ProductPaymentCart />
            <ProductPaymentCart />
            <ProductPaymentCart />
            <ProductPaymentCart />
          </div>
        </div>
        <div className="flex items-center justify-center flex-col gap-10">
          <div className="flex items-center justify-center flex-col gap-10 shadow-md p-5 py-10">
            <h2 className="text-[#C12F2F] font-black text-xl">
              YOUR INFORMATION
            </h2>
            <div className="flex flex-col items-center justify-center gap-10">
              <div class="shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.50),inset_2px_2px_4px_rgba(170,170,204,0.25),inset_5px_5px_10px_rgba(170,170,204,0.50),inset_-5px_-5px_10px_#FFF] rounded-[2.5rem] w-150 h-20 flex items-center justify-center">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-[80%] border-0 bg-transparent outline-none"
                />
                <img src={user} alt="" />
              </div>
              <div className="flex items-center justify-center gap-10">
                <div class="shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.50),inset_2px_2px_4px_rgba(170,170,204,0.25),inset_5px_5px_10px_rgba(170,170,204,0.50),inset_-5px_-5px_10px_#FFF] rounded-[2.5rem] w-70 h-20 flex items-center justify-center">
                  <input
                    type="tel"
                    placeholder="Number"
                    className="w-[60%] border-0 bg-transparent outline-none"
                  />
                  <img src={phone} alt="" />
                </div>
                <div class="shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.50),inset_2px_2px_4px_rgba(170,170,204,0.25),inset_5px_5px_10px_rgba(170,170,204,0.50),inset_-5px_-5px_10px_#FFF] rounded-[2.5rem] w-70 h-20 flex items-center justify-center">
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-[60%] border-0 bg-transparent outline-none"
                  />
                  <img src={email} alt="" />
                </div>
              </div>
              <div class="shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.50),inset_2px_2px_4px_rgba(170,170,204,0.25),inset_5px_5px_10px_rgba(170,170,204,0.50),inset_-5px_-5px_10px_#FFF] rounded-[2.5rem] w-150 h-20 flex items-center justify-center">
                <input
                  type="text"
                  placeholder="Address"
                  className="w-[80%] border-0 bg-transparent outline-none"
                />
                <img src={address} alt="" />
              </div>
              <div class="shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.50),inset_2px_2px_4px_rgba(170,170,204,0.25),inset_5px_5px_10px_rgba(170,170,204,0.50),inset_-5px_-5px_10px_#FFF] rounded-[2.5rem] w-150 h-85 flex flex-col items-center justify-center text-center">
                <div className="flex items-center justify-center gap-2 mt-5">
                  <p>Leave a message for us</p>
                  <img src={comment} alt="" />
                </div>
                <textarea className="h-[70%] w-[80%] border-0 bg-transparent outline-none"></textarea>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center flex-col gap-10 shadow-md p-5 pb-10">
            <h2 className="text-[#C12F2F] font-black text-xl">
              CHOOSE A PAYMENT METHOD
            </h2>
            <div className="flex items-center justify-center gap-8">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`
                relative cursor-pointer transition-all duration-300 ease-out
                ${
                  selectedMethod === method.id
                    ? "scale-105"
                    : "scale-100 hover:scale-102"
                }
              `}
                >
                  {/* Card Container */}
                  <div
                    className={`
                  w-46 h-46 rounded-xl p-6 
                  flex flex-col items-center justify-center gap-4
                  transition-all duration-300
                  ${selectedMethod === method.id ? "bg-white" : "bg-white"}
                  relative overflow-hidden
                  group
                `}
                    style={{
                      boxShadow:
                        selectedMethod === method.id
                          ? `inset 2px 2px 8px ${method.color.primary}40, inset -2px -2px 8px rgba(255,255,255,0.8)`
                          : "inset -2px -2px 4px rgba(255,255,255,0.50), inset 2px 2px 4px rgba(170,170,204,0.25), inset 5px 5px 10px rgba(170,170,204,0.50), inset -5px -5px 10px #FFF",
                    }}
                  >
                    {/* Animated Border on Hover */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 rounded-xl border-2 border-transparent animate-border-flow"></div>
                    </div>
                    <div
                      className="
                    w-16 h-16 rounded-full flex items-center justify-center
                    transition-transform duration-300
                    group-hover:scale-110"
                    >
                      <img
                        src={method.logo}
                        alt={method.name}
                        className="w-10 h-10 object-contain"
                      />
                    </div>

                    {/* Method Name */}
                    <p
                      className={`
                    text-sm font-semibold text-center
                    transition-colors duration-300
                  `}
                      style={{
                        color:
                          selectedMethod === method.id
                            ? method.color.primary
                            : "#374151",
                      }}
                    >
                      {method.name}
                    </p>

                    {/* Button */}
                    <button
                      className={`
                    px-4 py-1.5 rounded-full text-xs font-medium
                    transition-all duration-300
                  `}
                      style={{
                        backgroundColor:
                          selectedMethod === method.id
                            ? method.color.primary
                            : "white",
                        color:
                          selectedMethod === method.id
                            ? "white"
                            : method.color.primary,
                        border:
                          selectedMethod === method.id
                            ? "none"
                            : `1px solid ${method.color.primary}40`,
                        boxShadow:
                          selectedMethod === method.id
                            ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                            : "none",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedMethod !== method.id) {
                          e.target.style.backgroundColor = method.color.light;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedMethod !== method.id) {
                          e.target.style.backgroundColor = "white";
                        }
                      }}
                    >
                      Choose this type
                    </button>

                    {selectedMethod === method.id && (
                      <div
                        className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center animate-scale-in"
                        style={{ backgroundColor: method.color.primary }}
                      >
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    )}

                    {/* Shimmer Effect on Hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 shadow-md p-5 pb-10 w-165">
            <div className="flex flex-col gap-5 justify-center items-center">
              <h2 className="text-[#C12F2F] font-black text-xl">
                MAKE A PAYMENT
              </h2>
              <div className="flex justify-center flex-col text-[#374151]">
                <div className="flex gap-10 justify-between text-sm">
                  <p>Subtotal:</p>
                  <p>12000 VND</p>
                </div>
                <div className="flex gap-10 justify-between text-sm">
                  <p>Shipping Fee:</p>
                  <p>30000 VND</p>
                </div>
              </div>
              <hr className="w-full" />
              <div className="flex gap-10 justify-between">
                <p className="font-bold text-[#0A0A0A]">Total</p>
                <p className="bg-[linear-gradient(180deg,#EF4444_0%,#892727_100%)] bg-clip-text text-transparent font-black">
                  42000 VND
                </p>
              </div>
            </div>
            <button className="w-full mx-auto h-10 rounded-md hover:shadow-2xl hover:scale-101 cursor-pointer bg-[linear-gradient(90deg,#EF4444_0%,#892727_100%)] hover:![background-image:none] hover:border hover:border-2 hover:border-[#374151] hover:text-[#374151] hover:!bg-white transition-all duration-300 text-white font-light text-xs flex items-center justify-center gap-5 group">
              Checkout
            </button>
          </div>
        </div>
      </div>
      <Footer />
      <style>{`
        @keyframes border-flow {
          0% {
            box-shadow: 
              0 0 0 1px rgba(239, 68, 68, 0),
              0 0 10px rgba(239, 68, 68, 0);
          }
          50% {
            box-shadow: 
              0 0 0 2px rgba(239, 68, 68, 0.6),
              0 0 20px rgba(239, 68, 68, 0.4);
          }
          100% {
            box-shadow: 
              0 0 0 1px rgba(239, 68, 68, 0),
              0 0 10px rgba(239, 68, 68, 0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        @keyframes scale-in {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(0deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-border-flow {
          animation: border-flow 2s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }

        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .hover:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </>
  );
}
