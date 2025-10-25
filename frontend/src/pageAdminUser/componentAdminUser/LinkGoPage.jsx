import { Link } from "react-router-dom";
import { DataLink } from "./DataLink.js";
import "../../output.css";

export default function LinkGoPage() {
  return (
    <>
      {DataLink.map((element) => {
        const SvgIcon = element.svg;
        return (
          <div className="group" key={element.content}>
            <Link
              to={element.link}
              className="flex items-center m-2 gap-3 text-[#A3AED0] group-hover:text-red-700"
            >
              <SvgIcon className="m-2" />
              <p className="m-2 w-32">{element.content}</p>
              <div className="h-5 w-1 bg-red-600 hidden group-hover:block"></div>
            </Link>
          </div>
        );
      })}
    </>
  );
}
