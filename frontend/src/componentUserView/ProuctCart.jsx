import "../output.css";
import ball from "../assets/img/ball.png";
export default function ProductCart({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN");
  };
  const availableStock = 100;
  return (
    <>
      <div className="flex items-center justify-center shadow-sm rounded-lg hover:shadow-2xl">
        <div className="flex items-center justify-center gap-10 p-5">
          <img src={ball} alt="ball" className="w-20 h-20 rounded-xl" />
          <div className="flex flex-col gap-3 justify-center text-[#4B5563]">
            <h1 className="font-bold text-black">{item.name}</h1>
            <div className="flex items-center justify-center gap-10">
              <p className="text-sm">Size: {item.size}</p>
              <p className="text-sm">
                Available: {availableStock - item.quantity}
              </p>
              <div className="flex items-center justify-center gap-5">
                <span
                  className="w-6 h-6 border border-1 border-[#D1D5DB] rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-100"
                  onClick={onDecrease}
                >
                  -
                </span>
                <p className="text-black">{item.quantity}</p>
                <span
                  className="w-6 h-6 border border-1 border-[#D1D5DB] rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-100"
                  onClick={onIncrease}
                >
                  +
                </span>
              </div>
              <p className="font-bold text-black">
                {formatPrice(item.price * item.quantity)} VND
              </p>
              <svg
                className="cursor-pointer"
                onClick={onRemove}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M2.5 5H17.5"
                  stroke="#9CA3AF"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.8346 5V16.6667C15.8346 17.5 15.0013 18.3333 14.168 18.3333H5.83464C5.0013 18.3333 4.16797 17.5 4.16797 16.6667V5"
                  stroke="#9CA3AF"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.66797 5.00033V3.33366C6.66797 2.50033 7.5013 1.66699 8.33464 1.66699H11.668C12.5013 1.66699 13.3346 2.50033 13.3346 3.33366V5.00033"
                  stroke="#9CA3AF"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.33203 9.16699V14.167"
                  stroke="#9CA3AF"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.668 9.16699V14.167"
                  stroke="#9CA3AF"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="bg-[linear-gradient(180deg,#EF4444_0%,#892727_100%)] bg-clip-text text-transparent font-black">
              {formatPrice(item.price)} VND
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
