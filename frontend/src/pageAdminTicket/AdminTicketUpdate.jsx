import { useState } from "react";
import "../pageRegister/Register.css";
import ImgAdminUser01Component from "../pageAdminUser/componentAdminUser/ImgAdminUser01";
import LinkGoPage from "../pageAdminUser/componentAdminUser/LinkGoPage";
import Button from "../pageAdminUser/componentAdminUser/Button";

export default function AdminTicketUpdate() {
  const sold = 120; // Số lượng đã bán

  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({
    quantity: "",
    price: "",
  });

  const validateForm = () => {
    let newErrors = { quantity: "", price: "" };
    let isValid = true;

    // Kiểm tra Quantity
    const quantityNum = Number(quantity);
    if (quantity === "" || isNaN(quantityNum)) {
      newErrors.quantity = "Vui lòng nhập số lượng";
      isValid = false;
    } else if (quantityNum < 0) {
      newErrors.quantity = "Số lượng không được âm";
      isValid = false;
    } else if (quantityNum < sold) {
      newErrors.quantity = `Số lượng không được nhỏ hơn số đã bán (${sold})`;
      isValid = false;
    }

    // Kiểm tra Price
    const priceNum = Number(price);
    if (price === "" || isNaN(priceNum)) {
      newErrors.price = "Vui lòng nhập giá";
      isValid = false;
    } else if (priceNum < 0) {
      newErrors.price = "Giá không được âm";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
    if (errors.quantity) {
      setErrors((prev) => ({ ...prev, quantity: "" }));
    }
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
    if (errors.price) {
      setErrors((prev) => ({ ...prev, price: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form hợp lệ:", { quantity, price });
    }
  };

  return (
    <>
      <div className="bg-linear-[var(--colorBg)] flex">
        <div className="container flex flex-col shadow-3xl w-[20%] h-dvh items-center justify-center bg-white">
          <ImgAdminUser01Component />
          <LinkGoPage />
          <Button text={"Log Out"} />
        </div>
        <div className="w-[80%] bg-white mr-10 ml-10 mt-15 mb-10 shadow-2xl rounded-3xl flex items-center flex-col justify-center gap-5">
          <p className="text-2xl text-[#2B3674] font-bold">Update Ticket</p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-5 text-[#2B3674] text-sm"
          >
            <label className="flex gap-2">
              Ticket Area: <p>Tin dao</p>
            </label>
            <label className="flex gap-2">
              MatchID:<p> 001A</p>
            </label>
            <label className="flex gap-2">
              Sold:<p> {sold}</p>
            </label>
            <div className="flex gap-40">
              <label className="flex flex-col justify-center w-30 gap-5 relative">
                Quantity:
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className={`border rounded-[10px] h-10 px-2 ${
                    errors.quantity ? "border-red-500" : ""
                  }`}
                />
                {errors.quantity && (
                  <span className="text-red-500 text-xs absolute top-full left-0 mt-1 whitespace-nowrap">
                    {errors.quantity}
                  </span>
                )}
              </label>
              <label className="flex flex-col justify-center w-30 gap-5 relative">
                Price(VND):
                <input
                  type="number"
                  value={price}
                  onChange={handlePriceChange}
                  className={`border rounded-[10px] h-10 px-2 ${
                    errors.price ? "border-red-500" : ""
                  }`}
                />
                {errors.price && (
                  <span className="text-red-500 text-xs absolute top-full left-0 mt-1 whitespace-nowrap">
                    {errors.price}
                  </span>
                )}
              </label>
            </div>
          </form>
          <div onClick={handleSubmit}>
            <Button text="Update" />
          </div>
        </div>
      </div>
    </>
  );
}
