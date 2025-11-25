import Footer from "../componentUserView/Footer";
import Header from "../componentUserView/Header";
import "../output.css";
import Search from "../pageAdminTicket/componentAdminTicket/Search";
import { useState } from "react";
import ProductBio from "../componentUserView/ProductBio";
export default function ShoppingDetails() {
  const [priceRange, setPriceRange] = useState([0, 250000]);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = [
    "All Categories",
    "Ball",
    "HomeKit",
    "AwayKit",
    "Training Kit",
    "Accessories",
    "Footwear",
  ];

  const handlePriceChange = (e, index) => {
    const newRange = [...priceRange];
    const value = Number(e.target.value);

    if (index === 0) {
      // Min slider - không cho vượt quá max
      if (value <= priceRange[1]) {
        newRange[0] = value;
      }
    } else {
      // Max slider - không cho thấp hơn min
      if (value >= priceRange[0]) {
        newRange[1] = value;
      }
    }

    setPriceRange(newRange);
  };

  const formatPrice = (price) => {
    return price.toLocaleString();
  };

  return (
    <>
      <Header />
      <div className="w-[80%] h-full flex items-center justify-center mx-auto my-20">
        <div className="flex flex-col pt-10 gap-10 sticky top-25 self-start">
          <a href="/match" className="text-[#4B5563] flex items-center p-6">
            <p>Back to Home</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M6 12L10 8L6 4"
                stroke="#4B5563"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <div className="w-100 bg-white border-r border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-6">Filters</h2>

            {/* Price Range Filter */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-[#374151] mb-4">
                Price Range (VND)
              </label>
              <div className="relative pt-2 pb-6">
                {/* Track background */}
                <div className="relative h-1 bg-gray-200 rounded">
                  <div
                    className="absolute h-1 bg-black rounded"
                    style={{
                      left: `${(priceRange[0] / 250000) * 100}%`,
                      right: `${100 - (priceRange[1] / 250000) * 100}%`,
                    }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="250000"
                  step="1000"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  className="absolute w-full appearance-none bg-transparent cursor-pointer z-20"
                  style={{
                    top: "0",
                    height: "1rem",
                    WebkitAppearance: "none",
                  }}
                />

                <input
                  type="range"
                  min="0"
                  max="250000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                  className="absolute w-full appearance-none bg-transparent cursor-pointer z-20"
                  style={{
                    top: "0",
                    height: "1rem",
                    WebkitAppearance: "none",
                  }}
                />
              </div>
              <style>{`
            input[type="range"] {
              -webkit-appearance: none;
              appearance: none;
            }
            input[type="range"]::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: #000000;
              cursor: pointer;
            }
            input[type="range"]::-moz-range-thumb {
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: #000000;
              cursor: pointer;
            }
          `}</style>
              {/* Price Display */}
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>

              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-[#EFEFEF] border border-[#D1D5DB] rounded-md px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 transition-colors"
              >
                <span className="text-gray-700">{selectedCategory}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-[#EFEFEF] border border-[#D1D5DB] rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors ${
                        selectedCategory === category
                          ? "bg-blue-50 text-red-600"
                          : "text-gray-700"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Apply Button */}
            <button className="w-full h-10 rounded-lg hover:text-red-600 hover:shadow-2xl hover:scale-105 cursor-pointer bg-[#AD0000] text-white  font-bold flex items-center justify-center gap-5 group cursor-pointer mt-10">
              Filters
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center pt-10 gap-10 ">
          <Search bg="!bg-black" />
          <div className="grid grid-cols-3 gap-10">
            <ProductBio />
            <ProductBio />
            <ProductBio />
            <ProductBio />
            <ProductBio />
            <ProductBio />
            <ProductBio />
            <ProductBio />
            <ProductBio />
            <ProductBio />
            <ProductBio />
            <ProductBio />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
