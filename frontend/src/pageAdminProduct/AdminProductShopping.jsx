import "../output.css";
import ImgAdminUser01Component from "../pageAdminUser/componentAdminUser/ImgAdminUser01";
import LinkGoPage from "../pageAdminUser/componentAdminUser/LinkGoPage";
import Button from "../pageAdminUser/componentAdminUser/Button";
import api from "../Api/apitoken.js";
import { logout } from "../Api/logout.js";
import { useState, useEffect } from "react";

export default function AdminShopping() {
  const [showStats, setShowStats] = useState(false);
  const [showStats_Kit, setShowStats_Kit] = useState(false);
  const [showStats_Shoes, setShowStats_Shoes] = useState(false);
  const [showStats_Mini, setShowStats_Mini] = useState(false);
  const [kitName, setKitName] = useState("");
  const [kitImage, setKitImage] = useState(null);
  const [Main, setMain] = useState("");
  const [Sub, setSub] = useState("");
  const [kitList, setKitList] = useState([]);
  const [contentList, setContentList] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [title_shoes, setTitle_shoes] = useState("");
  const [content_shoes, setContent_shoes] = useState("");
  const [image1, setImage1] = useState(null);
  const [image1Preview, setImage1Preview] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image2Preview, setImage2Preview] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image3Preview, setImage3Preview] = useState(null);
  const [image4, setImage4] = useState(null);
  const [image4Preview, setImage4Preview] = useState(null);
  const [image5, setImage5] = useState(null);
  const [image5Preview, setImage5Preview] = useState(null);
  const [ballImages, setBallImages] = useState([null, null, null]);
  const [ballNames, setBallNames] = useState(["", "", ""]);
  const [accImages, setAccImages] = useState([null, null, null, null]);
  async function ensureFile(img, defaultName) {
    if (img instanceof File) return img; // file mới
    if (typeof img === "string") {
      const res = await fetch(img);
      const blob = await res.blob();
      return new File([blob], defaultName, { type: blob.type });
    }
    return null;
  }

  useEffect(() => {
    const loadShoppingConfig = async () => {
      try {
        const res = await api.get("/api/admin/shoppingpage/config");
        const data = res.data.data;
        console.log("📥 Loaded config:", data);

        /** INTRO */
        setTitle(data.introTitle || "");
        setContent(data.introContent || "");

        const introImgs = data.introImages || [];
        setImage1(introImgs[0] || null);
        setImage1Preview(introImgs[0] || null);

        setImage2(introImgs[1] || null);
        setImage2Preview(introImgs[1] || null);

        /** KITS */
        setKitList(
          (data.kits || []).map((kit) => ({
            name: kit.title || "",
            image: kit.image || null,
            file: null, // quan trọng → không làm hỏng FormData
          }))
        );

        /** BALLS */
        const balls = data.balls || [];
        setBallNames([
          balls[0]?.title || "",
          balls[1]?.title || "",
          balls[2]?.title || "",
        ]);
        setBallImages([
          balls[0]?.image || null,
          balls[1]?.image || null,
          balls[2]?.image || null,
        ]);

        /** ACCESSORIES */
        const acc = data.accessories || [];
        setAccImages([
          acc[0] || null,
          acc[1] || null,
          acc[2] || null,
          acc[3] || null,
        ]);

        /** SHOES */
        setTitle_shoes(data.shoesTitle || "");
        setContent_shoes(data.shoesContent || "");

        const shoesImgs = data.shoesImages || [];
        setImage3(shoesImgs[0] || null);
        setImage3Preview(shoesImgs[0] || null);

        setImage4(shoesImgs[1] || null);
        setImage4Preview(shoesImgs[1] || null);

        setImage5(shoesImgs[2] || null);
        setImage5Preview(shoesImgs[2] || null);

        /** MINI TITLES */
        setContentList(
          (data.shoesMiniTitles || []).map((item) => ({
            Main: item.main || "",
            Sub: item.sub || "",
          }))
        );

        console.log("🎉 All config loaded successfully");
      } catch (err) {
        console.error("❌ Error loading config:", err);
        alert("Không thể tải dữ liệu!");
      }
    };

    loadShoppingConfig();
  }, []);

  const handleUpdateShopping = async () => {
    try {
      const formData = new FormData();

      /** 1) JSON luôn chứa URL ảnh cũ */
      const jsonData = {
        introTitle: title,
        introContent: content,
        shoesTitle: title_shoes,
        shoesContent: content_shoes,
        introImages: [image1, image2].filter((x) => typeof x === "string"),
        shoesImages: [image3, image4, image5].filter(
          (x) => typeof x === "string"
        ),
        accessories: accImages.filter((x) => typeof x === "string"), // FIXED

        kits: kitList.map((kit) => ({
          title: kit.name,
          ...(typeof kit.image === "string" && { image: kit.image }),
        })),

        balls: ballImages.map((img, idx) => ({
          title: ballNames[idx] || "",
          ...(typeof img === "string" && { image: img }),
        })),

        shoesMiniTitles: contentList.map((item) => ({
          main: item.Main,
          sub: item.Sub,
        })),
      };

      formData.append(
        "data",
        new Blob([JSON.stringify(jsonData)], { type: "application/json" })
      );

      /** 2) CHỈ gửi file mới */
      formData.append("introImage1", await ensureFile(image1, "intro1.jpg"));
      formData.append("introImage2", await ensureFile(image2, "intro2.jpg"));
      formData.append("shoesImages", await ensureFile(image3, "intro3.jpg"));
      formData.append("shoesImages", await ensureFile(image4, "intro3.jpg"));
      formData.append("shoesImages", await ensureFile(image4, "intro3.jpg"));
      // KITS
      for (let i = 0; i < kitList.length; i++) {
        const kit = kitList[i];

        // Ưu tiên file mới, nếu không có thì dùng URL cũ
        const source = kit.file ? kit.file : kit.image;

        const file = await ensureFile(source, `kit_${i}.jpg`);

        if (file) formData.append("kitImages", file);
      }

      // BALLS
      for (let i = 0; i < ballImages.length; i++) {
        const img = ballImages[i];
        const file = await ensureFile(img, `ball_${i}.jpg`);
        if (file) formData.append("ballImages", file);
      }

      // ACCESSORIES
      for (let i = 0; i < accImages.length; i++) {
        const img = accImages[i];
        const file = await ensureFile(img, `acc_${i}.jpg`);
        if (file) formData.append("accessoryImages", file);
      }

      /** Debug */
      console.log("========= DEBUG FORMDATA =========");
      for (let [key, val] of formData.entries()) {
        console.log(key, val instanceof File ? val.name : "(JSON BLOB)");
      }

      /** Call API */
      const res = await api.put("/api/admin/shoppingpage/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Update thành công!", res.data);
    } catch (err) {
      console.error("❌ Update error:", err);
      alert("Update thất bại!");
    }
  };

  const handleAccImage = (e, index) => {
    const file = e.target.files[0];
    if (!file) {
      console.warn(`⚠️ No file selected for Accessories ${index + 1}`);
      return;
    }

    console.log(
      `✅ Accessories ${index + 1} selected:`,
      file.name,
      file.type,
      file.size
    );

    const newImages = [...accImages];
    newImages[index] = file;
    setAccImages(newImages);

    console.log(
      "📋 Updated accImages:",
      newImages.map((f, i) => (f ? `${i}: ${f.name}` : `${i}: null`))
    );
  };

  const handleImage1 = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage1(file);
    setImage1Preview(URL.createObjectURL(file));
  };

  const handleImage2 = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage2(file);
    setImage2Preview(URL.createObjectURL(file));
  };

  const handleImage3 = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage3(file);
    setImage3Preview(URL.createObjectURL(file));
  };

  const handleImage4 = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage4(file);
    setImage4Preview(URL.createObjectURL(file));
  };

  const handleImage5 = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage5(file);
    setImage5Preview(URL.createObjectURL(file));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("📁 File selected:", file.name, file.type, file.size);
      setKitImage(file);
    } else {
      console.warn("⚠️ No file selected");
    }
  };

  const handleEnter = () => {
    if (kitName.trim() !== "" && kitImage) {
      const imageUrl = URL.createObjectURL(kitImage);
      const newKit = {
        name: kitName.trim(),
        image: imageUrl,
        file: kitImage,
      };

      setKitList([...kitList, newKit]);

      console.log("✅ Kit added:", newKit);
      console.log("📋 Current kitList:", [...kitList, newKit]);

      setKitName("");
      setKitImage(null);

      const inputElement = document.getElementById("imageInput");
      if (inputElement) {
        inputElement.value = "";
      }
    } else {
      alert("⚠️ Vui lòng nhập tên Kit và chọn ảnh!");
    }
  };

  const handleEnter_Mini = () => {
    if (Main.trim() !== "" && Sub.trim() !== "") {
      setContentList([...contentList, { Main: Main.trim(), Sub: Sub.trim() }]);
      setMain("");
      setSub("");
    } else {
      alert("⚠️ Vui lòng nhập đầy đủ Main và Sub content!");
    }
  };

  const handleBallImage = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const newImages = [...ballImages];
    newImages[index] = file;
    setBallImages(newImages);
  };

  const handleBallName = (e, index) => {
    const newNames = [...ballNames];
    newNames[index] = e.target.value;
    setBallNames(newNames);
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
          <form
            onSubmit={(e) => {
              e.preventDefault(); // chặn reload trang
              handleUpdateShopping(); // gọi API
              closeAllPopups(); // đóng hết popup
            }}
            className="flex flex-col bg-white mx-4 h-[90%] rounded-3xl overflow-hidden items-center justify-center m-auto gap-5"
          >
            <p className="mx-6 text-[#2B3674] font-bold text-2xl my-2">
              Shopping Interface
            </p>
            <div className="flex flex-col items-center justify-center gap-3 w-full">
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
                      className="border border-1 rounded-sm w-20 h-20 text-xs italic flex items-center justify-center text-center cursor-pointer"
                    >
                      {ballImages[i] ? (
                        <img
                          src={
                            ballImages[i] instanceof File
                              ? URL.createObjectURL(ballImages[i])
                              : ballImages[i] // URL từ API
                          }
                          alt={`Ball ${i + 1}`}
                          className="w-full h-full object-cover rounded-sm"
                        />
                      ) : (
                        "Add Img " + (i + 1)
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleBallImage(e, i)}
                      />
                    </label>
                  ))}
                </div>
                <div className="grid grid-cols-3 grid-auto-rows-fr w-full gap-42 mt-3">
                  {[0, 1, 2].map((i) => (
                    <input
                      key={i}
                      type="text"
                      className="border border-1 rounded-sm w-20 h-7"
                      value={ballNames[i]}
                      onChange={(e) => handleBallName(e, i)}
                    />
                  ))}
                </div>
              </div>
              <div className="text-black w-[50%] flex flex-col">
                <label>Accessories</label>
                <div className="grid grid-cols-4 grid-auto-rows-fr w-full gap-22">
                  {[0, 1, 2, 3].map((i) => (
                    <label
                      key={i}
                      className="border border-1 rounded-sm w-20 h-20 text-xs italic flex items-center justify-center text-center cursor-pointer"
                    >
                      {accImages[i] ? (
                        <img
                          src={
                            accImages[i] instanceof File
                              ? URL.createObjectURL(accImages[i])
                              : accImages[i] // URL từ API
                          }
                          alt={`Accessory ${i + 1}`}
                          className="w-full h-full object-cover rounded-sm"
                        />
                      ) : (
                        "Add Img " + (i + 1)
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
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
                      {image1Preview ? (
                        <img
                          src={image1Preview}
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
                      {image2Preview ? (
                        <img
                          src={image2Preview}
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
                          src={URL.createObjectURL(kitImage)}
                          alt="preview"
                          className="w-full h-full object-cover rounded-sm"
                        />
                      ) : (
                        "Add Image"
                      )}
                      <input
                        id="imageInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
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
                      {image3Preview ? (
                        <img
                          src={image3Preview}
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
                      {image4Preview ? (
                        <img
                          src={image4Preview}
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
                      {image5Preview ? (
                        <img
                          src={image5Preview}
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
                type="submit"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
