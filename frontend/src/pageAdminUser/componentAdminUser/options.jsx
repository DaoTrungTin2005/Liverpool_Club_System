import "../../output.css";
import { Link } from "react-router-dom";
export default function Options(props) {
  return (
    <>
      <div className="flex gap-5">
        <Link to={props.link}>
          <button className="text-sm text-[#4B4B4B] h-10 w-30 border-1 italic hover:bg-red-600 hover:text-white">
            Yes, ok
          </button>
        </Link>
        <Link to={props.notlink}>
          <button className="text-sm text-[#4B4B4B] h-10 w-30 border-1 italic hover:bg-red-600 hover:text-white">
            No, cancel
          </button>
        </Link>
      </div>
    </>
  );
}
