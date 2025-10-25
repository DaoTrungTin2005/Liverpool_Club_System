import ImgAdminUser01 from "../../assets/img/ImgAdminUser01.png";
import "../../output.css";
export default function ImgAdminUser01Component() {
  return (
    <>
      <div className="flex justify-between items-center">
        <img src={ImgAdminUser01} alt="Admin User 01" />
        <p className="text-2xl font-bold">LIVERPOOL FC</p>
      </div>
    </>
  );
}
