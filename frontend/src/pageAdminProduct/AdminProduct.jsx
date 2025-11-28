import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../output.css";
import ImgAdminUser01Component from "../pageAdminUser/componentAdminUser/ImgAdminUser01";
import LinkGoPage from "../pageAdminUser/componentAdminUser/LinkGoPage";
import Button from "../pageAdminUser/componentAdminUser/Button";
import Search from "../pageAdminTicket/componentAdminTicket/Search.jsx";
import SvgAdminOrder, {
  SvgAdminDelete,
  SvgAdminView,
} from "../assets/svg/SvgAdmin";
import { SvgAdminUpdate } from "../assets/svg/SvgAdmin";
import { Link } from "react-router-dom";
import { logout } from "../Api/logout.js";
import api from "../Api/apitoken.js";

export default function AdminProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageSize = 5;
  const currentPage = parseInt(searchParams.get("page")) || 0;
  const searchTerm = searchParams.get("search") || "";

  // Fetch products from API
  const fetchProducts = async (page, search) => {
    setLoading(true);
    try {
      const response = await api.get(`api/products/list`, {
        params: { page, size: pageSize, search },
      });

      if (response.data.status === "success") {
        setProducts(response.data.data.content || []);
        setTotalPages(response.data.data.totalPages || 0);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Load products when URL params change
  useEffect(() => {
    fetchProducts(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  // Format price to VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  // Update URL params for pagination
  const updatePageParam = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params);
  };

  // Pagination handlers
  const handlePrev = () => {
    if (currentPage > 0) {
      updatePageParam(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      updatePageParam(currentPage + 1);
    }
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
          <div className="flex justify-between w-full items-center mb-6">
            <Search
              onSearch={(value) => {
                const params = new URLSearchParams(searchParams);
                params.set("search", value);
                params.set("page", 0);
                setSearchParams(params);
              }}
            />
            <div>
              <Button
                text="Shopping"
                className="cursor-pointer"
                onClick={() =>
                  (window.location.href = "/admin/product/shopping")
                }
              />
              <Button
                text="Add Product"
                className="cursor-pointer"
                onClick={() => (window.location.href = "/admin/product/add")}
              />
            </div>
          </div>
          <div className="flex flex-col bg-white mx-4 h-[80%] rounded-3xl overflow-hidden">
            <p className="mx-6 text-[#2B3674] font-bold text-2xl my-2">
              Product List
            </p>

            {/* === TABLE HEADER === */}
            <div className="grid grid-cols-10 mx-6 text-[#A3AED0] font-medium text-sm pb-2">
              <div className="flex items-center">IDProduct</div>
              <div className="flex items-center">Name</div>
              <div className="flex items-center mr-2">BioProduct</div>
              <div className="flex items-center">Price</div>
              <div className="flex items-center">Quantity</div>
              <div className="flex items-center">Sold</div>
              <div className="flex items-center">TypeProduct</div>
              <div className="flex items-center">Size</div>
              <div className="flex items-center mr-2">Image</div>
              <div className="flex items-center pl-5">Action</div>
            </div>

            {/* === TABLE BODY === */}
            <div className="overflow-y-auto">
              {loading ? (
                <div className="grid grid-cols-10 mx-6 text-[#A3AED0] font-medium text-sm pb-2 py-3">
                  <p className="col-span-10 text-center">Loading...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="grid grid-cols-10 mx-6 text-[#A3AED0] font-medium text-sm pb-2 py-3">
                  <p className="col-span-10 text-center">No products found</p>
                </div>
              ) : (
                products.map((product) => (
                  <div
                    key={product.variantId}
                    className="grid grid-cols-10 mx-6 text-[#A3AED0] font-medium text-sm pb-2 py-3"
                  >
                    <p className="flex items-center">{product.productId}</p>
                    <p className="flex items-center">{product.productName}</p>
                    <p className="flex items-center truncate mr-2">
                      {product.bio}
                    </p>
                    <p className="flex items-center">
                      {formatPrice(product.price)}
                    </p>
                    <p className="flex items-center">{product.quantity}</p>
                    <p className="flex items-center">{product.soldQuantity}</p>
                    <p className="flex items-center">{product.type}</p>
                    <p className="flex items-center">{product.size || ""}</p>
                    <p className="flex items-center truncate mr-2">
                      {product.image.split("/").pop()}
                    </p>
                    <div className="flex items-center gap-2 mr-2 pl-5">
                      <Link
                        to={`/admin/product/update`}
                        state={{ productId: product.productId }}
                      >
                        <SvgAdminUpdate className="cursor-pointer mr-4" />
                      </Link>
                      <Link
                        to={`/admin/product/delete`}
                        state={{ productId: product.productId }}
                      >
                        <SvgAdminDelete className="cursor-pointer" />
                      </Link>
                      <div className="pt-2 ml-2">
                        <Link
                          to={`/admin/product/view`}
                          state={{ productId: product.productId }}
                        >
                          <SvgAdminView className="cursor-pointer" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* === PAGINATION === */}
          </div>
          <div className="flex text-center justify-center gap-10 mt-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 0 || loading}
              className="disabled:opacity-50"
            >
              <SvgAdminOrder className="rotate-90 text-amber-50" />
            </button>
            <p className="font-bold text-white text-3xs">
              {currentPage + 1} / {totalPages}
            </p>
            <button
              onClick={handleNext}
              disabled={currentPage >= totalPages - 1 || loading}
              className="disabled:opacity-50"
            >
              <SvgAdminOrder className="rotate-270 text-amber-50" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
