import "../output.css";
import { SvgFacebook } from "../assets/svg/SvgSocialMedia";
import { SvgInstagram } from "../assets/svg/SvgSocialMedia";
import { SvgTwitter } from "../assets/svg/SvgSocialMedia";
export default function Footer() {
  return (
    <footer className="w-full bg-black text-white py-12 px-10 mt-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* SHOP */}
        <div>
          <h3 className="font-bold mb-4 tracking-wide text-gray-200">SHOP</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white cursor-pointer">Men</li>
            <li className="hover:text-white cursor-pointer">Women</li>
            <li className="hover:text-white cursor-pointer">Kids</li>
            <li className="hover:text-white cursor-pointer">Sale</li>
          </ul>
        </div>

        {/* HELP */}
        <div>
          <h3 className="font-bold mb-4 tracking-wide text-gray-200">HELP</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white cursor-pointer">Shipping</li>
            <li className="hover:text-white cursor-pointer">Returns</li>
            <li className="hover:text-white cursor-pointer">Size Guide</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h3 className="font-bold mb-4 tracking-wide text-gray-200">
            COMPANY
          </h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white cursor-pointer">About Us</li>
            <li className="hover:text-white cursor-pointer">Careers</li>
            <li className="hover:text-white cursor-pointer">Press</li>
            <li className="hover:text-white cursor-pointer">Sustainability</li>
          </ul>
        </div>

        {/* FOLLOW */}
        <div>
          <h3 className="font-bold mb-4 tracking-wide text-gray-200">FOLLOW</h3>

          <div className="flex gap-3">
            <div className="w-10 h-10 bg-neutral-800 rounded flex items-center justify-center cursor-pointer hover:bg-neutral-700">
              <SvgFacebook />
            </div>

            <div className="w-10 h-10 bg-neutral-800 rounded flex items-center justify-center cursor-pointer hover:bg-neutral-700">
              <SvgInstagram />
            </div>

            <div className="w-10 h-10 bg-neutral-800 rounded flex items-center justify-center cursor-pointer hover:bg-neutral-700">
              <SvgTwitter />
            </div>
          </div>
        </div>
      </div>

      {/* Line */}
      <div className="mt-10 border-t border-neutral-700 pt-6 text-center text-gray-500 text-sm">
        © 2025 YourWebsite. All Rights Reserved.
      </div>
    </footer>
  );
}
