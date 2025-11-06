import "../output.css";
import Header from "../componentUserView/Header";
import Liverpool_Banner from "../assets/img/Liverpool_Banner.png";
import Carabaocup from "../assets/img/Carabaocup.png";
import Premiercup from "../assets/img/Premiercup.png";
import C1 from "../assets/img/C1.png";
import CupFA from "../assets/img/CupFA.png";
import TotvsLiver from "../assets/img/TotvsLiv.png";
import Stadium from "../assets/img/Stadium.png";
import ViewStadium from "../assets/img/ViewSadium.png";
import Cancel from "../assets/img/Cancel.png";
import Button from "../pageAdminUser/componentAdminUser/Button";
import MOMO from "../assets/img/MOMO.png";
import { useState } from "react";

export default function Payment() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex flex-col Oxanium">
      <Header />
      <div className=" w-full h-70 pr-20  overflow-hidden">
        <div className=" w-full h-full m-10 text-5xl font-bold flex items-center justify-center bg-black text-white">
          <p>PAYMENT CONFIRMATION</p>
        </div>
      </div>
      <div className="flex items-center justify-center pt-28 gap-12 max-sm:gap-5 max-sm:pt-15 h-full"></div>
      <div className="bg-white w-full h-full m-auto flex flex-col pt-20 pb-50 items-center gap-10 justify-center">
        <p className="text-7xl font-bold">INFORMATION</p>
        <form className="flex flex-col gap-10">
          <div className="flex flex-col gap-10 w-200">
            <input
              type="text"
              placeholder="Please enter name..."
              className="border border-1 border-gray-500 h-10 w-full text-gray-500 text-xs italic"
            />
            <div className="flex w-full gap-[10%]">
              <input
                type="email"
                placeholder="Please enter email..."
                className="border border-1 border-gray-500 h-10 w-[45%] text-gray-500 text-xs italic"
              />
              <input
                type="tel"
                placeholder="Please enter number..."
                className="border border-1 border-gray-500 h-10 w-[45%] text-gray-500 text-xs italic"
              />
            </div>
            <input
              type="text"
              placeholder="Please enter Address..."
              className="border border-1 border-gray-500 h-10 w-full text-gray-500 text-xs italic"
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-10">
            <p className="text-black text-4xl text-center">CHAMPION LEAGUE</p>
            <div className="w-200 flex items-center justify-between gap-15 text-4xl bg-[#EEEEEE]">
              <img src={C1} alt="" className="w-15 h-15" />
              <p className="w-70">Liverpool</p>
              <img src={Carabaocup} alt="" className="w-15 h-15" />
              <p className="w-70">Real Madrid</p>
              <img src={CupFA} alt="" className="w-15 h-15" />
            </div>
            <div className="flex text-2xl gap-10 items-center justify-center">
              <p>28TH MAY 2026</p>
              <div className="w-[1px] h-6 border border-1 border-black"></div>
              <p>20:00 PM</p>
              <div className="w-[1px] h-6 border border-1 border-black"></div>
              <p>ANFIELD STADIUM</p>
            </div>
          </div>
          <fieldset className="text-center border border-1 border-gray-500 h-40 w-120 m-auto font-medium text-xl ">
            <legend>CE1 - LONGSIDE LOWER TIER</legend>
            <div className="flex items-center justify-center gap-10 my-10">
              <div className="w-40 h-10 bg-red-600 text-white flex items-center justify-center">
                <p>Quantity: 300</p>
              </div>
              <div className="w-40 h-10 bg-red-600 text-white flex items-center justify-center">
                <p>Quantity: 300</p>
              </div>
            </div>
          </fieldset>
          <div className="flex flex-col items-center justify-center py-20 gap-10">
            <p className="text-3xl font-bold">MAKE A PAYMENT</p>
            <div className="flex gap-5">
              <input
                type="text"
                className="w-100 h-50 border border-1 border-gray-500 text-gray-500 text-xs italic text-center "
                placeholder="Leave a message for Liverpool Club"
              />
              <div className="flex gap-5 flex-col">
                {[1, 2, 3].map((id) => (
                  <div
                    key={id}
                    className={`w-100 h-13 flex items-center justify-center gap-50 bg-white cursor-pointer rounded border border-1 border-gray-500 text-gray-500 text-xs italic text-center
            ${selected === id ? "ring-4 ring-red-500 border-red-500" : ""}`}
                    onClick={() => setSelected(id)}
                  >
                    <p>Payment by MOMO</p>
                    <img src={MOMO} alt="momo" />
                    <input
                      type="radio"
                      name="payment"
                      className="hidden"
                      checked={selected === id}
                      onChange={() => setSelected(id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-210 h-20 bg-red-500 text-white text-3xl font-bold rounded-2xl shadow-2xl"
          >
            MAKE A PAYMENT
          </button>
        </form>
      </div>
    </div>
  );
}
