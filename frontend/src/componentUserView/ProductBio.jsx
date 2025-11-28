import "../output.css";
import ball from "../assets/img/ball.png";

export default function ProductBio({ onClick, product }) {
  // Hàm format giá
  const formatPrice = (price) => {
    return price?.toLocaleString() || "0";
  };

  return (
    <>
      <div className="rounded-lg flex flex-col shadow-xl pb-10 gap-5 cursor-pointer">
        <img
          src={product?.image || ball}
          alt={product?.productName || "ball"}
          className="h-3/4"
          onClick={onClick}
        />
        <div
          className="flex items-center justify-center gap-5 px-2"
          onClick={onClick}
        >
          <p className="font-bold text-lg">
            {product?.productName || "STRIKER ELITE"}
          </p>
          <p className="text-[#4B5563] text-xs">
            Size {product?.size || "N/A"}
          </p>
        </div>
        <p
          className="text-left text-[#EF4444] font-bold px-3.5"
          onClick={onClick}
        >
          {formatPrice(product?.price)} VND
        </p>
        <button className="w-9/10 mx-auto h-15 rounded-md hover:shadow-2xl hover:scale-105 cursor-pointer bg-[linear-gradient(90deg,#EF4444_0%,#892727_100%)] text-white font-bold flex items-center justify-center gap-5 group cursor-pointer">
          Add to Cart
        </button>
      </div>
    </>
  );
}
