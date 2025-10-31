import "../output.css";
import Header from "../componentUserView/Header";
import Tilte from "../assets/img/Tilte.png";
import Position from "../componentUserView/Position.jsx";
import Image from "../assets/img/ViewPlayer.png";
import PositionImage from "../componentUserView/PositionImage.jsx";

export default function MyClub() {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="relative w-full h-80 overflow-hidden">
        <img
          src={Tilte}
          alt="Liverpool fans"
          className="absolute inset-0 w-full h-80 object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center pt-15">
          <div className="bg-white/30 backdrop-blur-sm px-8 py-4  rounded-lg w-full flex justify-center">
            <p className="text-white font-black text-4xl text-7xl tracking-wider text-shadow-md">
              FC LIVERPOOL - FIRST TEAM
            </p>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-[#a11a1a] to-[#2a0000] bg-blend-color-burn w-full">
        <div className=" bg-white w-[90%] h-full m-auto flex flex-col">
          <div className="flex items-center justify-center pt-28 gap-12">
            <button className="border-1 w-32 h-10 bg-black shadow-2xl text-white text-sm font-bold hover:bg-[linear-gradient(90deg,#A21E1E_0%,#3C0B0B_100%)]">
              GOALKEEPERS
            </button>
            <button className="border-1 w-32 h-10 bg-black shadow-2xl text-white text-sm font-bold hover:bg-[linear-gradient(90deg,#A21E1E_0%,#3C0B0B_100%)]">
              DEFENDERS
            </button>
            <button className="border-1 w-32 h-10 bg-black shadow-2xl text-white text-sm font-bold hover:bg-[linear-gradient(90deg,#A21E1E_0%,#3C0B0B_100%)]">
              MIDIFIELDERS
            </button>
            <button className="border-1 w-32 h-10 bg-black shadow-2xl text-white text-sm font-bold hover:bg-[linear-gradient(90deg,#A21E1E_0%,#3C0B0B_100%)]">
              FORWARDS
            </button>
          </div>
          <div className="flex flex-col gap-10 items-center justify-center pt-30">
            <Position name="GOALKEEPERS"></Position>
            <div className="grid grid-cols-3 gap-15">
              <PositionImage
                image={Image}
                alt="V4"
                playerName="Cac"
                goal="77"
                match="2"
                assists="12"
              />
              <PositionImage image={Image} alt="V4" />
              <PositionImage image={Image} alt="V4" />
              <PositionImage image={Image} alt="V4" />
              <PositionImage image={Image} alt="V4" />
              <PositionImage image={Image} alt="V4" />
            </div>
          </div>
          <div className="flex flex-col gap-10 items-center justify-center pt-30">
            <Position name="DEFENDERS"></Position>
            <div className="grid grid-cols-3 gap-15">
              <PositionImage
                image={Image}
                alt="V4"
                playerName="Cac"
                goal="77"
                match="2"
                assists="12"
              />
              <PositionImage image={Image} alt="V4" />
              <PositionImage image={Image} alt="V4" />
              <PositionImage image={Image} alt="V4" />
              <PositionImage image={Image} alt="V4" />
              <PositionImage image={Image} alt="V4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
