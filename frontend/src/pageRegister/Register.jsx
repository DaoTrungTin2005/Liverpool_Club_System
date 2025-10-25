import "../output.css";
import "./Register.css";
import Form from "./componentRegister/Form.jsx";
import Line from "./componentRegister/Line.jsx";
import BGregister from "./componentRegister/BGregister.jsx";
import Logoregister from "./componentRegister/Logoregister.jsx";
import SvgGoogle from "../assets/svg/svgGoogle.jsx";
import { SvgFacebook } from "../assets/svg/SvgSocialMedia.jsx";
import { SvgTwitter } from "../assets/svg/SvgSocialMedia.jsx";
import { SvgInstagram } from "../assets/svg/SvgSocialMedia.jsx";
import { SvgLinkedIn } from "../assets/svg/SvgSocialMedia.jsx";
import { Link } from "react-router-dom";
export default function Register() {
  return (
    <>
      <div className="flex flex-row text-white">
        <BGregister></BGregister>
        <div className="container w-[70.4%] max-sm:w-dvw  items-center justify-center">
          <div className="flex flex-col bg-linear-[var(--colorBg)] items-center justify-center h-dvh">
            <Logoregister></Logoregister>
            <p className="text-3xl p-1 m-1">Create an account</p>
            <button className="flex text-base border border-white items-center gap-4 px-12 m-2 py-2 cursor-pointer hover:outline-2 justify-center rounded-lg">
              Create account with Google
              <SvgGoogle></SvgGoogle>
            </button>
            <div className="flex justify-center items-center gap-4">
              <Line></Line>
              <p>Or</p>
              <Line></Line>
            </div>
            <Form></Form>
            <label htmlFor="" className="mb-2 text-black font-bold">
              Already have an account?{" "}
              <Link to="/login" className="text-white hover:text-gray-200">
                Login
              </Link>
            </label>
            <div className="flex gap-6">
              <SvgFacebook></SvgFacebook>
              <SvgTwitter></SvgTwitter>
              <SvgInstagram></SvgInstagram>
              <SvgLinkedIn></SvgLinkedIn>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
