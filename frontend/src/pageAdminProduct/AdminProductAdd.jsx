import ImgAdminUser01Component from "../pageAdminUser/componentAdminUser/ImgAdminUser01.jsx";
import LinkGoPage from "../pageAdminUser//componentAdminUser/LinkGoPage.jsx";
import Button from "../pageAdminUser//componentAdminUser/Button.jsx";
import "../pageRegister/Register.css";
import { useState } from "react";
import { logout } from "../Api/logout.js";
import api from "../Api/apitoken.js";

export default function AdminProductAdd() {
  const [productName, setProductName] = useState("");
  const [type, setType] = useState("");
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [Size, setSize] = useState("");
  const [Price, setPrice] = useState("");
  const [Quantity, setQuantity] = useState("");
  const [contentList, setContentList] = useState([]);
  const [showStats_Mini, setShowStats_Mini] = useState(false);
  const [ImagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const close = () => {
    setShowStats_Mini(false);
  };

  const handleEnter_Mini = () => {
    if (Size.trim() !== "" && Price.trim() !== "" && Quantity.trim() !== "") {
      setContentList([
        ...contentList,
        {
          size: Size.trim(),
          price: parseFloat(Price.trim()),
          quantity: parseInt(Quantity.trim()),
        },
      ]);
      setSize("");
      setPrice("");
      setQuantity("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!productName.trim()) {
      alert("Please enter product name");
      return;
    }
    if (!type) {
      alert("Please select product type");
      return;
    }
    if (!bio.trim()) {
      alert("Please enter product bio");
      return;
    }
    if (!imageFile) {
      alert("Please select product image");
      return;
    }
    if (contentList.length === 0) {
      alert("Please add at least one size variant");
      return;
    }

    setLoading(true);

    try {
      // Tạo FormData để gửi file
      const formData = new FormData();

      // Tạo object data theo format backend yêu cầu
      const productData = {
        productName: productName,
        type: type,
        bio: bio,
        variants: contentList,
      };

      // Tạo Blob từ JSON string với Content-Type
      const dataBlob = new Blob([JSON.stringify(productData)], {
        type: "application/json",
      });

      // Tạo Blob từ image file
      const imageBlob = new Blob([imageFile], {
        type: imageFile.type,
      });

      formData.append("data", dataBlob, "data.json");
      formData.append("productImage", imageBlob, imageFile.name);

      // Không set Content-Type header, để axios tự động set
      const response = await api.post("/api/products/add", formData);

      if (response.data.status === "success") {
        alert("Add product successfully!");
        // Reset form
        setProductName("");
        setType("");
        setBio("");
        setImageFile(null);
        setImagePreview(null);
        setContentList([]);
        // Redirect về trang product list
        window.location.href = "/admin/product";
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
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
            Add Product
          </p>
          <form
            className="flex flex-col items-center justify-center gap-3 w-full"
            onSubmit={handleSubmit}
          >
            <label className="flex flex-col w-[40%]">
              ProductName:
              <input
                type="text"
                className="text-black border border-1 rounded-sm w-full h-10 px-2"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </label>
            <div className="flex items-center w-[40%]">
              <label className="flex flex-col w-full">
                Type:
                <input
                  className="border rounded-md p-2 text-black w-[50%]"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  {/* <option value="">-- Choose --</option>
                  <option value="Home Kit">Home Kit</option>
                  <option value="Away Kit">Away Kit</option>
                  <option value="Third Kit">Third Kit</option>
                  <option value="Training Kit">Training Kit</option> */}
                </input>
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
                <label className="w-full text-black border border-1 rounded-sm h-30 cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {ImagePreview ? (
                    <img
                      src={ImagePreview}
                      alt="preview"
                      className="w-full h-30 object-cover rounded-sm"
                    />
                  ) : (
                    <div className="w-full h-30 flex items-center justify-center text-gray-400">
                      Click to upload
                    </div>
                  )}
                </label>
              </div>
              <div className="flex flex-col w-[65%] items-center">
                <p>Bio:</p>
                <textarea
                  className="w-full text-black border border-1 rounded-sm h-30 px-2 py-1"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
              </div>
            </div>
            {showStats_Mini && (
              <div className="fixed shadow-2xl bg-white flex flex-col items-center justify-center z-50 w-150 h-120 m-auto gap-5">
                <input
                  className="text-gray-500 border border-1 rounded-sm w-[50%] h-10 flex items-center justify-center italic text-xs px-2"
                  placeholder="Enter size"
                  value={Size}
                  onChange={(e) => setSize(e.target.value)}
                ></input>
                <input
                  className="text-gray-500 border border-1 rounded-sm w-[50%] h-10 flex items-center justify-center italic text-xs px-2"
                  placeholder="Enter price"
                  type="number"
                  value={Price}
                  onChange={(e) => setPrice(e.target.value)}
                ></input>
                <input
                  className="text-gray-500 border border-1 rounded-sm w-[50%] h-10 flex items-center justify-center italic text-xs px-2"
                  placeholder="Enter quantity"
                  type="number"
                  value={Quantity}
                  onChange={(e) => setQuantity(e.target.value)}
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
                  className="rounded-lg !bg-[linear-gradient(90deg,#FE0101_0%,#461111_100%)] !RussoOne !p-0 !m-4 cursor-pointer"
                  onClick={close}
                />
              </div>
            )}
            <Button
              text={loading ? "Adding..." : "ADD"}
              type="submit"
              disabled={loading}
              className="rounded-lg !bg-[linear-gradient(90deg,#FE0101_0%,#461111_100%)] !RussoOne !p-0 !m-4 cursor-pointer disabled:opacity-50"
            />
          </form>
        </div>
      </div>
    </>
  );
}
