// src/componentUserView/CardTour.jsx
export default function CardTour({ image, name, onViewMore }) {
  return (
    <div
      className="
        relative w-64 h-80 rounded-3xl overflow-hidden 
        shadow-2xl transform transition-all duration-300 
        hover:scale-105 hover:shadow-3xl cursor-pointer
        group
      "
    >
      {/* Ảnh + hiệu ứng blur khi hover */}
      <div className="relative w-full h-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="
            absolute inset-0 w-full h-full object-cover 
            blur-sm 
            group-hover:blur-none 
            transition-all duration-300
          "
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Chữ - blur khi bình thường, rõ khi hover */}
        <div className="absolute bottom-20 left-0 right-0 text-center">
          <h3
            className="
              text-3xl md:text-4xl font-bold text-white 
              [font-family:'Bangers',cursive] 
              drop-shadow-2xl tracking-wider
              blur-xs 
              group-hover:blur-none 
              transition-all duration-300
              mb-5
            "
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
          >
            {name}
          </h3>
        </div>
      </div>

      {/* Nút VIEW MORE – KHÔNG BLUR, luôn rõ */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <button
          onClick={() => {
            if (onViewMore) onViewMore(name); // gọi hàm từ Match.jsx
          }}
          className="
            px-6 py-2 bg-white/20 backdrop-blur-sm 
            text-black font-bold text-xs tracking-wider 
            rounded-full border border-white/50 
            shadow-lg transition-all duration-300
            group-hover:bg-black group-hover:scale-110
            group-hover:text-white shadow-red-500
            ring-red-500 group-hover:shadow-yellow-50 cursor-pointer
          "
        >
          VIEW MORE
        </button>
      </div>
    </div>
  );
}
