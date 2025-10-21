import "../output.css";
import "./Login.css";
import Form from "./componentLogin/Form.jsx";
import Line from "../pageRegister/componentRegister/Line.jsx";
import BGregister from "../pageRegister/componentRegister/BGregister.jsx";
import Logoregister from "../pageRegister/componentRegister/Logoregister.jsx";
import SvgGoogle from "../assets/svg/svgGoogle.jsx";
import { SvgFacebook } from "../assets/svg/SvgSocialMedia.jsx";
import { SvgTwitter } from "../assets/svg/SvgSocialMedia.jsx";
import { SvgInstagram } from "../assets/svg/SvgSocialMedia.jsx";
import { SvgLinkedIn } from "../assets/svg/SvgSocialMedia.jsx";
import { Link } from "react-router-dom";
export default function Login() {
  return (
    <>
      <div className="flex flex-row text-white">
        <BGregister></BGregister>
        <div className="container w-[58.4%] max-sm:w-dvw  items-center justify-center">
          <div className="flex flex-col bg-linear-[var(--colorBg)] items-center justify-center h-dvh">
            <Logoregister></Logoregister>
            <p className="text-3xl p-1 m-1">Welcome Back</p>
            <button className="flex text-base border border-white items-center gap-4 px-12 m-2 py-2 cursor-pointer hover:outline-2 justify-center rounded-lg">
              Sign in with Google
              <SvgGoogle></SvgGoogle>
            </button>
            <div className="flex justify-center items-center gap-4">
              <Line></Line>
              <p>Or</p>
              <Line></Line>
            </div>
            <Form></Form>
            <label htmlFor="" className="mb-2 text-black font-bold">
              Don't have an account?{" "}
              <Link to="/register" className="text-white hover:text-gray-200">
                Register now
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
