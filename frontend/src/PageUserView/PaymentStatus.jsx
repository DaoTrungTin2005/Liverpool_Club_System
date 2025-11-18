export default function PaymentSuccess() {
  const handleBackToHome = () => {
    window.location.href = "/match";
  };

  return (
    <>
      {/* Đảm bảo dùng được Tailwind (thêm class="h-screen" để full chiều cao) */}
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center transform transition-all hover:scale-105">
          {/* Icon thành công */}
          <div className="mx-auto w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <svg
              className="w-14 h-14 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Tiêu đề */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Thanh toán thành công!
          </h1>

          {/* Thông báo phụ */}
          <p className="text-gray-600 text-lg mb-8">
            Cảm ơn bạn đã tin tưởng và mua hàng ❤️
            <br />
            Đơn hàng đang được xử lý...
          </p>

          {/* Nút quay về trang chủ */}
          <button
            onClick={handleBackToHome}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold text-lg py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
          >
            Quay về trang chủ
          </button>

          {/* Dòng chữ nhỏ dưới cùng (tuỳ chọn) */}
          <p className="mt-6 text-gray-500 text-sm">
            Nếu không tự chuyển, vui lòng nhấn nút bên trên.
          </p>
        </div>
      </div>
    </>
  );
}

export function PaymentFailed() {
  const goHome = () => (window.location.href = "/match");

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 to-rose-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-10 text-center">
        {/* Icon sai */}
        <div className="mx-auto w-28 h-28 bg-red-500 rounded-full flex items-center justify-center mb-8">
          <svg
            className="w-16 h-16 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Thanh toán thất bại
        </h1>
        <p className="text-gray-600 text-lg mb-10">
          Rất tiếc, giao dịch không thành công.
          <br />
          Vui lòng thử lại hoặc liên hệ hỗ trợ.
        </p>

        <button
          onClick={goHome}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xl py-4 rounded-xl transition duration-300"
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
}
