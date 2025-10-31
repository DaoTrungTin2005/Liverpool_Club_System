import "../output.css";
import Header from "./Header";
import BackgroundPlayer from "./BackgroundPlayer";
import BodyPlayer from "./BodyPlayer";
import backgroundplayer from "../assets/img/backgroundplayer.png";
import Position from "../componentUserView/Position.jsx";
import Image from "../assets/img/ViewPlayer.png";
import PositionImage from "../componentUserView/PositionImage.jsx";
export default function ProfilePlayer() {
  return (
    <>
      <Header />
      <BackgroundPlayer
        img={backgroundplayer}
        namePlayer="MOHAMED SALAH"
        numberPlayer="#11"
      />
      <BodyPlayer
        fullBio="123"
        dateOfBirth="20/11/2000"
        location="VietNam"
        nationality="VietNam"
        joinedClub="21/10/2025"
      />
      <div className="flex flex-col gap-10 items-center justify-center pt-30">
        <Position name="ORTHER TIN DAO"></Position>
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
        </div>
      </div>
    </>
  );
}
