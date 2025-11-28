import ImgAdminUser01Component from "../pageAdminUser/componentAdminUser/ImgAdminUser01.jsx";
import LinkGoPage from "../pageAdminUser//componentAdminUser/LinkGoPage.jsx";
import Button from "../pageAdminUser//componentAdminUser/Button.jsx";
import "../pageRegister/Register.css";
import { useState } from "react";
import { logout } from "../Api/logout.js";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../Api/apitoken.js";

export default function AdminProductView() {
  const location = useLocation();
  const productId = location.state?.productId;
  const [contentList, setContentList] = useState([]);
  const [showStats_Mini, setShowStats_Mini] = useState();
  const [productName, setProductName] = useState("");
  const [type, setType] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/products/detail/${productId}`);
        if (res.data.status === "success") {
          const p = res.data.data;

          setProductName(p.productName);
          setType(p.type);
          setBio(p.bio);
          setImage(p.productImage);

          setContentList(
            p.variants.map((v) => ({
              size: v.size,
              price: v.price,
              quantity: v.quantity,
            }))
          );
        }
      } catch (err) {
        console.error("Error loading product:", err);
      }
    };

    fetchProduct();
  }, [productId]);

  const close = () => {
    setShowStats_Mini(false);
  };
  return (
    <>
      <div className="bg-linear-[var(--colorBg)] flex">
        {/* ==== SIDEBAR ==== */}
        <div className="container flex flex-col shadow-3xl w-[20%] h-dvh items-center justify-center bg-white">
          <ImgAdminUser01Component />
          <LinkGoPage />
          <Button text={"Log Out"} onClick={logout} />
        </div>

        {/* ==== MAIN CONTENT ==== */}
        <div className="w-[80%] bg-white mr-10 ml-10 mt-15 mb-10 shadow-2xl rounded-3xl flex items-center flex-col justify-center gap-5">
          <p className="mx-6 text-[#2B3674] font-bold text-2xl my-2">
            View Product
          </p>
          <form className="flex flex-col items-center justify-center gap-3 w-full">
            <label className="flex flex-col w-[40%]">
              ProductName:
              <label />
              {productName}
            </label>
            <div className="flex items-center w-[40%]">
              <label className="flex flex-col w-full">
                Type:
                <label
                  className="border rounded-md p-2 text-black w-[50%]"
                  onChange={(e) => console.log(e.target.value)}
                >
                  {type}
                </label>
              </label>
              <span
                className="border w-20 h-10 border-1 flex items-center rounded-sm justify-center mt-5 cursor-pointer"
                onClick={() => {
                  setShowStats_Mini(true);
                }}
              >
                Size
              </span>
            </div>
            <div className="flex items-center w-[40%] gap-5">
              <div className="flex flex-col w-[35%] items-center">
                <p>ProductImage:</p>
                <img
                  src={image}
                  className="w-full text-black border border-1 rounded-sm h-30"
                ></img>
              </div>
              <div className="flex flex-col w-[65%] items-center">
                <p>Bio:</p>
                <label className="w-full text-black border border-1 rounded-sm h-30">
                  {bio}
                </label>
              </div>
            </div>
            {showStats_Mini && (
              <div className="fixed shadow-2xl bg-white flex flex-col items-center justify-center z-50 w-150 h-120 m-auto gap-5">
                <div className="w-[80%] max-h-64 overflow-y-auto flex flex-wrap justify-center gap-4 pb-4">
                  {contentList.map((content, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-50 border border-gray-300 rounded-lg p-3 shadow-sm gap-2"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm font-bold text-gray-700">
                          Size: {content.size}
                        </span>
                        <span className="text-sm italic text-gray-700">
                          Price: {content.price}
                        </span>
                        <span className="text-sm italic text-red-500">
                          Quantity: {content.quantity}
                        </span>
                        <span
                          onClick={() =>
                            setContentList(
                              contentList.filter((_, i) => i !== index)
                            )
                          }
                          className="text-red-500 hover:text-red-700 font-bold text-xl leading-none cursor-pointer"
                        >
                          <span className="rounded-[100%] text-white bg-red-500 w-6 h-6 flex items-center justify-center">
                            ×
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                  {contentList.length === 0 && (
                    <p className="text-gray-400 italic text-sm">Product none</p>
                  )}
                </div>
                <Button
                  text="Update"
                  className="rounded-lg !bg-[linear-gradient(90deg,#FE0101_0%,#461111_100%)] !RussoOne !p-0 !m-4 curpsor-pointer"
                  onClick={close}
                />
              </div>
            )}
            <Link to={"/admin/product"}>
              <Button
                text="BACK"
                className="rounded-lg !bg-[linear-gradient(90deg,#FE0101_0%,#461111_100%)] !RussoOne !p-0 !m-4 curpsor-pointer"
              />
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}
