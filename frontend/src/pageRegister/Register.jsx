import "../output.css";
import "./Register.css";
import Form from "./componentRegister/Form.jsx";
import Line from "./componentRegister/Line.jsx";
import BGregister from "./componentRegister/BGregister.jsx";
import Logoregister from "./componentRegister/Logoregister.jsx";
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
        <div className="container w-[70.4%] max-sm:w-dvw max-sm:h-dvh items-center justify-center">
          <div className="flex flex-col bg-linear-[var(--colorBg)] items-center justify-center h-dvh">
            <Logoregister></Logoregister>
            <p className="text-3xl p-1 m-1">Create an account</p>

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
