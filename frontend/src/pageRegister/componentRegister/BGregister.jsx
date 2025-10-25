import "../../output.css";
import bgRegister from "../../assets/img/bgRegister01.png";
export default function LogoRight() {
  return (
    <img
      src={bgRegister}
      alt="Firmino"
      className="container w-[33.6%] h-dvh max-sm:hidden object-cover"
    />
  );
}
