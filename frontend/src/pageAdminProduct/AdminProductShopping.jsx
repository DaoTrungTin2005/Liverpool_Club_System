import "../output.css";
import ImgAdminUser01Component from "../pageAdminUser/componentAdminUser/ImgAdminUser01";
import LinkGoPage from "../pageAdminUser/componentAdminUser/LinkGoPage";
import Button from "../pageAdminUser/componentAdminUser/Button";
import Search from "../pageAdminTicket/componentAdminTicket/Search.jsx";
import { SvgAdminUpdate } from "../assets/svg/SvgAdmin";
import { Link } from "react-router-dom";
import { logout } from "../Api/logout.js";
import { useState } from "react";
export default function AdminShopping() {
  const [showStats, setShowStats] = useState(false);
  const [showStats_Kit, setShowStats_Kit] = useState(false);
  const [showStats_Shoes, setShowStats_Shoes] = useState(false);
  const [showStats_Mini, setShowStats_Mini] = useState(false);
  const [kitName, setKitName] = useState("");
  const [kitImage, setKitImage] = useState(null); // lưu file ảnh hoặc URL
  const [Main, setMain] = useState("");
  const [Sub, setSub] = useState("");
  const [kitList, setKitList] = useState([]);
  const [contentList, setContentList] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [title_shoes, setTitle_shoes] = useState("");
  const [content_shoes, setContent_shoes] = useState("");
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [image5, setImage5] = useState(null);
  const [ballImages, setBallImages] = useState([null, null, null]);
  const [accImages, setAccImages] = useState([null, null, null, null]);

  const handleAccImage = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    const newImages = [...accImages];
    newImages[index] = url;

    setAccImages(newImages);
  };

  const handleImage1 = (e) => {
    if (e.target.files[0]) setImage1(URL.createObjectURL(e.target.files[0]));
  };
  const handleImage2 = (e) => {
    if (e.target.files[0]) setImage2(URL.createObjectURL(e.target.files[0]));
  };
  const handleImage3 = (e) => {
    if (e.target.files[0]) setImage3(URL.createObjectURL(e.target.files[0]));
  };
  const handleImage4 = (e) => {
    if (e.target.files[0]) setImage4(URL.createObjectURL(e.target.files[0]));
  };
  const handleImage5 = (e) => {
    if (e.target.files[0]) setImage5(URL.createObjectURL(e.target.files[0]));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setKitImage(imageUrl);
    }
  };

  const handleEnter = () => {
    if (kitName.trim() !== "" && kitImage) {
      setKitList([...kitList, { name: kitName.trim(), image: kitImage }]);
      setKitName("");
      setKitImage(null);
      // Reset input file (rất quan trọng để chọn lại cùng 1 ảnh)
      document.getElementById("imageInput").value = "";
    }
  };
  const handleEnter_Mini = () => {
    if (Main.trim() !== "" && Sub.trim() !== "") {
      setContentList([...contentList, { Main: Main.trim(), Sub: Sub.trim() }]);
      setMain("");
      setSub("");
    }
  };
  const handleBallImage = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    const newImages = [...ballImages];
    newImages[index] = url;

    setBallImages(newImages);
  };
  const close = () => {
    setShowStats_Mini(false);
  };
  const closeAllPopups = () => {
    setShowStats(false);
    setShowStats_Kit(false);
    setShowStats_Shoes(false);
  };
  return (
    <>
      <div className="bg-linear-[var(--colorBg)] flex">
        <div className="container flex flex-col shadow-3xl w-[20%] h-dvh items-center justify-center bg-white">
          <ImgAdminUser01Component />
          <LinkGoPage />
          <Button text="Log Out" onClick={logout} />
        </div>
        <div className="flex flex-col w-[78%]">
          <div className="flex flex-col bg-white mx-4 h-[90%] rounded-3xl overflow-hidden items-center justify-center m-auto gap-5">
            <p className="mx-6 text-[#2B3674] font-bold text-2xl my-2">
              Shopping Interface
            </p>
            <form className="flex flex-col items-center justify-center gap-3 w-full">
              <div
                className="text-black border border-1 rounded-sm w-[50%] h-10 flex items-center justify-center cursor-pointer"
                onClick={() => setShowStats(true)}
              >
                Introduce
              </div>
              <div
                className="text-black border border-1 rounded-sm w-[50%] h-10 flex items-center justify-center cursor-pointer"
                onClick={() => setShowStats_Kit(true)}
              >
                Kit
              </div>
              <div className="text-black w-[50%] flex flex-col">
                <label>OurBall</label>
                <div className="grid grid-cols-3 grid-auto-rows-fr w-full gap-42">
                  {[0, 1, 2].map((i) => (
                    <label
                      key={i}
                      className="border border-1 rounded-sm w-20 h-20 text-xs italic flex items-center justify-center text-center"
                    >
                      {ballImages[i] ? (
                        <img
                          src={ballImages[i]}
                          className="w-full h-full object-cover rounded-sm"
                        />
                      ) : (
                        "Add Img " + (Number(i) + Number(1))
                      )}
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleBallImage(e, i)}
                      />
                    </label>
                  ))}
                </div>
                <div className="grid grid-cols-3 grid-auto-rows-fr w-full gap-42 mt-3">
                  <input
                    type="text"
                    className="border border-1 rounded-sm w-20 h-7"
                  />
                  <input
                    type="text"
                    className="border border-1 rounded-sm w-20 h-7"
                  />
                  <input
                    type="text"
                    className="border border-1 rounded-sm w-20 h-7"
                  />
                </div>
              </div>
              <div className="text-black w-[50%] flex flex-col">
                <label>Accessories</label>
                <div className="grid grid-cols-4 grid-auto-rows-fr w-full gap-22">
                  {[0, 1, 2, 3].map((i) => (
                    <label
                      key={i}
                      className="border border-1 rounded-sm w-20 h-20 text-xs italic flex items-center justify-center text-center"
                    >
                      {accImages[i] ? (
                        <img
                          src={accImages[i]}
                          className="w-full h-full object-cover rounded-sm"
                        />
                      ) : (
                        "Add Img " + (Number(i) + Number(1))
                      )}
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleAccImage(e, i)}
                      />
                    </label>
                  ))}
                </div>
              </div>
              <div
                className="text-black border border-1 rounded-sm w-[50%] h-10 flex items-center justify-center cursor-pointer"
                onClick={() => setShowStats_Shoes(true)}
              >
                Shoes
              </div>
              {showStats && (
                <div className="fixed shadow-2xl bg-white flex flex-col items-center justify-center z-50 w-150 h-120 m-auto gap-5">
                  <input
                    className="text-gray-500 border border-1 rounded-sm w-[50%] h-10 flex items-center justify-center italic text-xs"
                    placeholder="Introduce Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  ></input>
                  <textarea
                    className="text-gray-500 border border-1 rounded-sm w-[50%] h-30 flex items-center justify-center italic text-xs"
                    placeholder="Introduce Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  ></textarea>
                  <div className="flex items-center justify-evenly w-full">
                    <label className="border border-1 rounded-sm w-20 h-20 flex items-center justify-center text-center text-gray-500 italic text-xs cursor-pointer hover:border-red-500 transition">
                      {image1 ? (
                        <img
                          src={image1}
                          className="w-full h-full object-cover rounded-sm"
                        />
                      ) : (
                        "Add Image 1"
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImage1}
                      />
                    </label>

                    <label className="border border-1 rounded-sm w-20 h-20 flex items-center justify-center text-center text-gray-500 italic text-xs cursor-pointer hover:border-red-500 transition">
                      {image2 ? (
                        <img
                          src={image2}
                          className="w-full h-full object-cover rounded-sm"
                        />
                      ) : (
                        "Add Image 2"
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImage2}
                      />
                    </label>
                  </div>
                  <Button
                    text="Update"
                    className="rounded-lg !bg-[linear-gradient(90deg,#FE0101_0%,#461111_100%)] !RussoOne !p-0 !m-4 "
                    onClick={closeAllPopups}
                  />
                </div>
              )}
              {showStats_Kit && (
                <div className="fixed shadow-2xl bg-white flex flex-col items-center justify-center z-50 w-150 h-120 m-auto gap-5">
                  <input
                    className="text-gray-500 border border-1 rounded-sm w-[50%] h-10 flex items-center justify-center italic text-xs"
                    placeholder="Type Kit"
                    value={kitName}
                    onChange={(e) => setKitName(e.target.value)}
                  ></input>
                  <div className="flex items-center justify-center w-full">
                    <label className="border border-gray-400 rounded-sm w-24 h-24 flex flex-col items-center justify-center text-center text-gray-500 italic text-xs cursor-pointer hover:border-red-500 transition">
                      {kitImage ? (
                        <img
                          src={kitImage}
                          alt="preview"
                          className="w-full h-full object-cover rounded-sm"
                        />
                      ) : (
                        <>
                          Add Image
                          <input
                            id="imageInput"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </>
                      )}
                      {kitImage && (
                        <input
                          id="imageInput"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      )}
                    </label>
                  </div>
                  <span
                    className="w-15 h-8 bg-green-500 text-white rounded-sm text-center pt-1 cursor-pointer"
                    onClick={handleEnter}
                  >
                    Enter
                  </span>
                  <div className="w-[80%] max-h-64 overflow-y-auto flex flex-wrap justify-center gap-4 pb-4">
                    {kitList.map((kit, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-50 border border-gray-300 rounded-lg p-3 shadow-sm gap-2"
                      >
                        <img
                          src={kit.image}
                          alt={kit.name}
                          className="w-20 h-20 object-cover rounded-md mb-2"
                        />
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-sm font-medium text-gray-700">
                            {kit.name}
                          </span>
                          <span
                            onClick={() =>
                              setKitList(kitList.filter((_, i) => i !== index))
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
                    {kitList.length === 0 && (
                      <p className="text-gray-400 italic text-sm">Kit none</p>
                    )}
                  </div>
                  <Button
                    text="Update"
                    className="rounded-lg !bg-[linear-gradient(90deg,#FE0101_0%,#461111_100%)] !RussoOne !p-0 !m-4 curpsor-pointer"
                    onClick={closeAllPopups}
                  />
                </div>
              )}
              {showStats_Shoes && (
                <div className="fixed shadow-2xl bg-white flex flex-col items-center justify-center z-50 w-150 h-120 m-auto gap-5">
                  <input
                    className="text-gray-500 border border-1 rounded-sm w-[50%] h-10 flex items-center justify-center italic text-xs"
                    placeholder="Title"
                    value={title_shoes}
                    onChange={(e) => setTitle_shoes(e.target.value)}
                  ></input>
                  <textarea
                    className="text-gray-500 border border-1 rounded-sm w-[50%] h-30 flex items-center justify-center italic text-xs"
                    placeholder="Content"
                    value={content_shoes}
                    onChange={(e) => setContent_shoes(e.target.value)}
                  ></textarea>
                  <div
                    className="text-black border border-1 rounded-sm w-[50%] h-10 flex items-center justify-center italic text-xs cursor-pointer"
                    onClick={() => {
                      setShowStats_Mini(true);
                    }}
                  >
                    Mini Title
                  </div>
                  <div className="flex items-center justify-between w-[50%]">
                    <label className="border border-1 rounded-sm w-20 h-20 flex items-center justify-center text-center text-gray-500 italic text-xs cursor-pointer hover:border-red-500 transition">
                      {image3 ? (
                        <img
                          src={image3}
                          className="w-full h-full object-cover rounded-sm"
                        />
                      ) : (
                        "Add Image 1"
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImage3}
                      />
                    </label>

                    <label className="border border-1 rounded-sm w-20 h-20 flex items-center justify-center text-center text-gray-500 italic text-xs cursor-pointer hover:border-red-500 transition">
                      {image4 ? (
                        <img
                          src={image4}
                          className="w-full h-full object-cover rounded-sm"
                        />
                      ) : (
                        "Add Image 2"
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImage4}
                      />
                    </label>

                    <label className="border border-1 rounded-sm w-20 h-20 flex items-center justify-center text-center text-gray-500 italic text-xs cursor-pointer hover:border-red-500 transition">
                      {image5 ? (
                        <img
                          src={image5}
                          className="w-full h-full object-cover rounded-sm"
                        />
                      ) : (
                        "Add Image 3"
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImage5}
                      />
                    </label>
                  </div>
                  <Button
                    text="Update"
                    className="rounded-lg !bg-[linear-gradient(90deg,#FE0101_0%,#461111_100%)] !RussoOne !p-0 !m-4 "
                    onClick={closeAllPopups}
                  />
                </div>
              )}
              {showStats_Mini && (
                <div className="fixed shadow-2xl bg-white flex flex-col items-center justify-center z-50 w-150 h-120 m-auto gap-5">
                  <input
                    className="text-gray-500 border border-1 rounded-sm w-[50%] h-10 flex items-center justify-center italic text-xs"
                    placeholder="Main Content"
                    value={Main}
                    onChange={(e) => setMain(e.target.value)}
                  ></input>
                  <input
                    className="text-gray-500 border border-1 rounded-sm w-[50%] h-10 flex items-center justify-center italic text-xs"
                    placeholder="Sub Content"
                    value={Sub}
                    onChange={(e) => setSub(e.target.value)}
                  ></input>
                  <span
                    className="w-15 h-8 bg-green-500 text-white rounded-sm text-center pt-1 cursor-pointer"
                    onClick={handleEnter_Mini}
                  >
                    Enter
                  </span>
                  <div className="w-[80%] max-h-64 overflow-y-auto flex flex-wrap justify-center gap-4 pb-4">
                    {contentList.map((content, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-50 border border-gray-300 rounded-lg p-3 shadow-sm gap-2"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-sm font-bold text-gray-700">
                            {content.Main}
                          </span>
                          <span className="text-sm italic text-gray-700">
                            {content.Sub}
                          </span>
                          <span
                            onClick={() =>
                              setContentList(
                                kitList.filter((_, i) => i !== index)
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
                      <p className="text-gray-400 italic text-sm">Mini none</p>
                    )}
                  </div>
                  <Button
                    text="Update"
                    className="rounded-lg !bg-[linear-gradient(90deg,#FE0101_0%,#461111_100%)] !RussoOne !p-0 !m-4 curpsor-pointer"
                    onClick={close}
                  />
                </div>
              )}
              <Button
                text="Update"
                className="rounded-lg !bg-[linear-gradient(90deg,#FE0101_0%,#461111_100%)] !RussoOne !p-0 !m-4 "
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
