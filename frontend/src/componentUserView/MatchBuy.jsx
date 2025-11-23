import "../output.css";
import Button from "../pageAdminUser/componentAdminUser/Button";
import { useNavigate } from "react-router-dom";
export default function MatchBuy(props) {
  const navigate = useNavigate();
  const time = props.time;
  const [hour, ampm] = time.split(" ");

  console.log(hour); // "10:35"
  console.log(ampm); // "PM"

  const handleViewMore = () => {
    // Truyền matchId sang trang Ticket
    navigate("/ticket", {
      state: { matchId: props.id }, // props.id là match.id từ API
    });
  };
  return (
    <>
      <div className="h-full relative text-white group rounded-3xl RussoOne">
        <img
          src={props.img}
          alt={props.img}
          className="w-full h-full rounded-3xl"
        />
        <div className="absolute inset-0 group-hover:bg-black/26 group-hover:border group-hover:border-5 group-hover:blur-[2px] bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 pointer-events-none rounded-3xl group-hover:border-[#777] group-hover:scale-102" />
        <div className="absolute z-50 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bottom-0 left-[50%] right-[50%]">
          <div className="flex flex-col gap-0">
            <p
              className="leading-none text-4xl text-transparent drop-shadow-lg uppercase tracking-widest text-center !RussoOne"
              style={{ WebkitTextStroke: "0.5px #FFFF" }}
            >
              {props.home}
            </p>

            <p className="leading-none font-[Russo One] text-3xl text-center text-red-600">
              VS
            </p>

            <p
              className="leading-none text-4xl text-transparent drop-shadow-lg font-light uppercase tracking-widest text-center"
              style={{ WebkitTextStroke: "0.5px #FFFF" }}
            >
              {props.away}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-5 p-5 mt-5">
            <fieldset className="border-2 border-white px-10 py-2 rounded-lg text-thin text-center font-normal text-xs RussoOne">
              <legend>{props.tournament.toUpperCase()}</legend>
              <label className="flex gap-5 items-center justify-center">
                <div className="flex gap-2">
                  <p>{hour}</p>
                  <p>{ampm}</p>
                </div>
                <div className="h-5 w-[1px] border border-1 border-amber-50"></div>
                <p>{props.date}</p>
              </label>
            </fieldset>
            <Button
              text="VIEW MORE"
              onClick={handleViewMore}
              className="rounded-lg !bg-[linear-gradient(90deg,#FE0101_0%,#461111_100%)] !RussoOne !p-0 !m-0"
            />
          </div>
        </div>
      </div>
    </>
  );
}
