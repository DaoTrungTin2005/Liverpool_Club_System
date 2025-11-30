import Footer from "../componentUserView/Footer";
import Header from "../componentUserView/Header";
import "../output.css";
import Search from "../pageAdminTicket/componentAdminTicket/Search";
import { useState } from "react";
import ProductBio from "../componentUserView/ProductBio";
import FrameX from "../assets/img/FrameX_2.png";
import ball from "../assets/img/ball.png";
import api from "../Api/apitoken";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ShoppingDetails() {
  const location = useLocation();
  const searchTo = location.state?.searchTo;
  const [priceRange, setPriceRange] = useState([0, 250000]);
  const [originalRange, setOriginalRange] = useState([0, 250000]);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const availableStock = 100;
  const [type, setType] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [productSizes, setProductSizes] = useState([]);

  // Fetch categories
  useEffect(() => {
    const fetchType = async () => {
      try {
        const response = await api.get("/api/products/types");
        if (response.data?.status === "success") {
          setType(["All Categories", ...response.data.data]);
        } else {
          console.error("API trả về lỗi:", response.data);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchType();
  }, []);

  // Fetch ALL products (chỉ gọi 1 lần để lấy tất cả variants)
  const fetchAllProducts = async () => {
    try {
      const res = await api.get("/api/products/shop");
      const data = res.data.data;

      console.log("📦 Fetched ALL products:", data);

      // Hiển thị sản phẩm với giá thấp nhất
      const lowestPriceProducts = getLowestPriceProducts(data);
      setProducts(lowestPriceProducts);

      // Tính price range
      calculatePriceRange(data);
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  };

  // Fetch filtered products (chỉ để hiển thị, KHÔNG đè allProductData)
  const fetchFilteredProducts = async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // Thêm type nếu không phải "All Categories"
      if (params.type && params.type !== "All Categories") {
        queryParams.append("type", params.type);
      }

      // Thêm price range
      if (params.minPrice !== undefined) {
        queryParams.append("minPrice", params.minPrice);
      }
      if (params.maxPrice !== undefined) {
        queryParams.append("maxPrice", params.maxPrice);
      }

      // Thêm search query
      if (params.search && params.search.trim()) {
        queryParams.append("search", params.search.trim());
      }

      const queryString = queryParams.toString();

      // Nếu không có params nào, gọi lại fetchAllProducts
      if (!queryString) {
        fetchAllProducts();
        return;
      }

      const url = `/api/products/shop?${queryString}`;

      console.log("🔍 Calling filtered API:", url);

      const res = await api.get(url);
      const data = res.data.data;

      console.log("📦 Filtered API Response:", data);

      // CHỈ update products để hiển thị, KHÔNG đè allProductData
      const lowestPriceProducts = getLowestPriceProducts(data);
      setProducts(lowestPriceProducts);

      // Nếu search mà không có kết quả
      if (params.search && params.search.trim() && data.length === 0) {
        alert("Không tìm thấy sản phẩm");
      }
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    }
  };

  // Initial load - lấy TẤT CẢ products
  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Xử lý searchTo từ navigation
  useEffect(() => {
    if (searchTo) {
      setSearchQuery(searchTo);
      fetchFilteredProducts({
        type: selectedCategory,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        search: searchTo,
      });
    }
  }, [searchTo]);

  const calculatePriceRange = (list) => {
    if (!list || list.length === 0) return;
    const prices = list.map((item) => item.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    setPriceRange([min, max]);
    setOriginalRange([min, max]);
  };

  const getLowestPriceProducts = (products) => {
    const productMap = new Map();
    products.forEach((product) => {
      const existing = productMap.get(product.productId);
      if (!existing || product.price < existing.price) {
        productMap.set(product.productId, product);
      }
    });
    return Array.from(productMap.values());
  };

  // Apply filters - gọi API với params
  const handleApplyFilters = () => {
    fetchFilteredProducts({
      type: selectedCategory,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      search: searchQuery,
    });
  };

  // Xử lý search từ Search component
  const handleSearch = (value) => {
    setSearchQuery(value);
    fetchFilteredProducts({
      type: selectedCategory,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      search: value,
    });
  };

  const openPopup = async (product) => {
    try {
      console.log(
        "🔍 Fetching product detail for productId:",
        product.productId
      );

      // Gọi API lấy chi tiết sản phẩm với đầy đủ variants
      const res = await api.get(`/api/products/detail/${product.productId}`);
      const productDetail = res.data.data;

      console.log("📦 Product detail response:", productDetail);

      // Map variants thành format cho sizes
      const sizes = productDetail.variants.map((variant) => ({
        size: variant.size,
        price: variant.price,
        variantId: variant.id,
        stock: variant.quantity - variant.soldQuantity,
      }));

      // Set product info với data từ API detail
      setSelectedProduct({
        ...product,
        productName: productDetail.productName,
        bio: productDetail.bio,
        image: productDetail.productImage,
        type: productDetail.type,
      });

      setProductSizes(sizes);
      setIsPopupOpen(true);
      setSelectedSize(null);
      setQuantity(1);

      console.log("✅ Loaded sizes:", sizes);
    } catch (error) {
      console.error("❌ Error fetching product detail:", error);
      alert("Không thể tải thông tin sản phẩm. Vui lòng thử lại!");
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedProduct(null);
    setProductSizes([]);
    setSelectedSize(null);
  };

  const handleSelectSize = (sizeData) => {
    setSelectedSize(sizeData);
  };

  const increaseQuantity = () => {
    const maxStock = selectedSize?.stock || availableStock;
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    if (quantity < maxStock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const totalPrice =
    (selectedSize?.price || selectedProduct?.price || 0) * quantity;

  const formatPrice = (price) => {
    return price?.toLocaleString() || "0";
  };

  // Hàm add to cart
  const handleAddToCart = async () => {
    // Validate: phải chọn size trước
    if (!selectedSize) {
      alert("Vui lòng chọn size trước khi thêm vào giỏ hàng!");
      return;
    }

    // Validate: phải có productId
    if (!selectedProduct?.productId) {
      alert("Không tìm thấy thông tin sản phẩm!");
      return;
    }

    try {
      const payload = {
        productId: selectedProduct.productId,
        variantId: selectedSize.variantId,
        quantity: quantity || 1, // Mặc định là 1 nếu không có quantity
      };

      console.log("🛒 Adding to cart:", payload);

      const response = await api.post("/api/cart/add", payload);

      if (response.data?.status === "success") {
        // Thông báo thành công
        alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);

        // Dispatch event để Header tự động refresh
        window.dispatchEvent(new Event("cartUpdated"));

        // Optional: Đóng popup sau khi add
        // closePopup();

        console.log("✅ Add to cart success:", response.data);
      } else {
        alert("Không thể thêm vào giỏ hàng. Vui lòng thử lại!");
        console.error("❌ Add to cart failed:", response.data);
      }
    } catch (error) {
      console.error("❌ Error adding to cart:", error);

      // Xử lý các lỗi cụ thể
      if (error.response?.status === 401) {
        alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      } else if (error.response?.status === 400) {
        alert(error.response?.data?.message || "Thông tin không hợp lệ!");
      } else {
        alert("Có lỗi xảy ra. Vui lòng thử lại!");
      }
    }
  };

  const handlePriceChange = (e, index) => {
    const newRange = [...priceRange];
    const value = Number(e.target.value);

    if (index === 0 && value <= priceRange[1]) {
      newRange[0] = value;
    } else if (index === 1 && value >= priceRange[0]) {
      newRange[1] = value;
    }

    setPriceRange(newRange);
  };

  return (
    <>
      <Header />
      <div className="w-[65%] h-full flex items-center justify-center mx-auto my-20 gap-5">
        <div className="flex flex-col pt-10 gap-5 sticky top-25 self-start">
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
          <div className="w-70 bg-white border-r border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-6">Filters</h2>

            {/* Price Range Filter */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-[#374151] mb-4">
                Price Range (VND)
              </label>
              <div
                className="relative pt-2 pb-6"
                style={{ pointerEvents: "none" }}
              >
                <div className="relative h-1 bg-gray-200 rounded">
                  <div
                    className="absolute h-1 bg-black rounded"
                    style={{
                      left: `${
                        ((priceRange[0] - originalRange[0]) /
                          (originalRange[1] - originalRange[0])) *
                        100
                      }%`,
                      right: `${
                        100 -
                        ((priceRange[1] - originalRange[0]) /
                          (originalRange[1] - originalRange[0])) *
                          100
                      }%`,
                    }}
                  />
                </div>
                <input
                  type="range"
                  min={originalRange[0]}
                  max={originalRange[1]}
                  step="1000"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  className="absolute w-full appearance-none bg-transparent cursor-pointer z-20"
                  style={{
                    top: "0",
                    height: "1rem",
                    pointerEvents: "auto",
                    WebkitAppearance: "none",
                  }}
                />

                <input
                  type="range"
                  min={originalRange[0]}
                  max={originalRange[1]}
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                  className="absolute w-full appearance-none bg-transparent cursor-pointer z-20"
                  style={{
                    top: "0",
                    height: "1rem",
                    pointerEvents: "auto",
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

              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-[#EFEFEF] border border-[#D1D5DB] rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {type.map((category, index) => (
                    <button
                      key={index}
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
            <button
              onClick={handleApplyFilters}
              className="w-full h-10 rounded-lg hover:text-red-600 hover:shadow-2xl hover:scale-105 cursor-pointer bg-[#AD0000] text-white font-bold flex items-center justify-center gap-5 group mt-10"
            >
              Apply Filters
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center pt-10 gap-10">
          <Search bg="!bg-black" onSearch={handleSearch} />
          <div className="grid grid-cols-3 gap-10">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductBio
                  key={product.variantId}
                  onClick={() => openPopup(product)}
                  product={product}
                />
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500">
                No products found
              </p>
            )}
          </div>
        </div>
        {isPopupOpen && selectedProduct && (
          <div className="bg-[linear-gradient(180deg,#8B0000_0%,#383838_100%)] w-[60%] h-[82%] fixed m-auto mt-30 inset-0 flex items-center justify-center z-50">
            <div className="bg-white w-[95%] h-[90%] border border-1 border-[#CE3B3B] rounded-[2.375rem] relative">
              <img
                src={FrameX}
                alt="FrameX"
                className="absolute top-5 left-5 w-15 h-15 cursor-pointer hover:opacity-80"
                onClick={closePopup}
              />
              <div className="p-3 w-full h-full flex gap-5">
                <img
                  src={selectedProduct.image || ball}
                  alt={selectedProduct.productName}
                  className="w-[50%] h-[80%] rounded-2xl object-cover"
                />
                <div className="flex flex-col gap-2 text-[#374151]">
                  <div className="flex flex-col gap-1">
                    <h1 className="font-bold text-3xl text-black">
                      {selectedProduct.productName}
                    </h1>
                    <h2 className="bg-[linear-gradient(180deg,#EF4444_0%,#892727_100%)] bg-clip-text text-transparent font-bold text-2xl">
                      {formatPrice(totalPrice)} VND
                    </h2>
                  </div>
                  <p className="text-sm mb-3">
                    {selectedProduct.bio ||
                      "Engineered for precision and power. Features high-tech advanced construction for superior performance."}
                  </p>
                  <h3 className="text-sm">Select Size</h3>
                  <div className="flex items-center gap-3">
                    {productSizes.map((sizeData, index) => (
                      <span
                        key={index}
                        onClick={() => handleSelectSize(sizeData)}
                        className={`w-10 h-10 border border-1 flex items-center justify-center rounded-md cursor-pointer transition-all ${
                          selectedSize?.size === sizeData.size
                            ? "bg-[linear-gradient(180deg,#EF4444_0%,#892727_100%)] text-white border-[#EF4444]"
                            : "border-[#D1D5DB] hover:border-[#EF4444]"
                        }`}
                      >
                        {sizeData.size}
                      </span>
                    ))}
                  </div>
                  <h3>Quantity</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center gap-5">
                      <span
                        onClick={decreaseQuantity}
                        className="w-8 h-8 border border-1 border-[#D1D5DB] rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100"
                      >
                        -
                      </span>
                      <p>{quantity}</p>
                      <span
                        onClick={increaseQuantity}
                        className="w-8 h-8 border border-1 border-[#D1D5DB] rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100"
                      >
                        +
                      </span>
                    </div>
                    <h3 className="flex items-center justify-between text-xs gap-2">
                      Available:
                      <p className="bg-[linear-gradient(180deg,#EF4444_0%,#892727_100%)] bg-clip-text text-transparent font-bold">
                        {selectedSize?.stock ||
                          Number(selectedProduct.quantity) -
                            Number(selectedProduct.soldQuantity) ||
                          availableStock}
                      </p>
                    </h3>
                  </div>
                  <button className="w-full mx-auto h-25 rounded-md hover:shadow-2xl hover:scale-101 cursor-pointer bg-[linear-gradient(90deg,#EF4444_0%,#892727_100%)] hover:![background-image:none] hover:border hover:border-2 hover:border-[#EF4444] hover:text-red-500 hover:!bg-white transition-all duration-300 text-white font-light text-xs flex items-center justify-center gap-5 group">
                    Buy Now
                  </button>
                  <button
                    className="w-full mx-auto h-25 rounded-md hover:shadow-2xl hover:scale-101 cursor-pointer bg-[linear-gradient(90deg,#EF4444_0%,#892727_100%)] hover:![background-image:none] hover:border hover:border-2 hover:border-[#EF4444] hover:text-red-500 hover:!bg-white transition-all duration-300 text-white font-light text-xs flex items-center justify-center gap-5 group"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                  <h3 className="font-bold text-black text-sm">Key Features</h3>
                  <div className="text-xs flex gap-2 flex-col">
                    <div className="flex gap-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M13.3346 4L6.0013 11.3333L2.66797 8"
                          stroke="#22C55E"
                          strokeWidth="1.33333"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p>Premium quality materials</p>
                    </div>
                    <div className="flex gap-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M13.3346 4L6.0013 11.3333L2.66797 8"
                          stroke="#22C55E"
                          strokeWidth="1.33333"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p>Advanced construction</p>
                    </div>
                    <div className="flex gap-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M13.3346 4L6.0013 11.3333L2.66797 8"
                          stroke="#22C55E"
                          strokeWidth="1.33333"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p>Optimal performance</p>
                    </div>
                    <div className="flex gap-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M13.3346 4L6.0013 11.3333L2.66797 8"
                          stroke="#22C55E"
                          strokeWidth="1.33333"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p>Durable design</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
