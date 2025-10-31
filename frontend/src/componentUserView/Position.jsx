import "../output.css";
import PositionImg from "./PositionImage";
export default function Position({ name = "GOALKEEPERS" }) {
  return (
    <p className=" font-bold text-red-700 mb-2 text-7xl text-[#670c0c]">
      {name}
    </p>
  );
}
