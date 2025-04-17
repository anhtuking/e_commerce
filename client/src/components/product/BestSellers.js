import React, { memo, useEffect, useState } from "react";
import { apiGetProducts } from "api/product";
import Product from "./Product";
import Slider from "react-slick";
import { HiArrowSmRight, HiArrowSmLeft } from 'react-icons/hi';
import { BsStarFill } from 'react-icons/bs';
import { MdLocalFireDepartment } from 'react-icons/md';
import { IoFlash } from 'react-icons/io5';

const tabs = [
  { id: 1, name: "Bán chạy nhất", icon: <MdLocalFireDepartment className="text-orange-500" size={20} /> },
  { id: 2, name: "Mới nhất", icon: <IoFlash className="text-blue-500" size={20} /> },
];

// Custom arrow components for the slider
const NextArrow = ({ onClick }) => (
  <div 
    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all transform hover:scale-110"
    onClick={onClick}
  >
    <HiArrowSmRight className="text-gray-700" size={22} />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div 
    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all transform hover:scale-110"
    onClick={onClick}
  >
    <HiArrowSmLeft className="text-gray-700" size={22} />
  </div>
);

const BestSellers = () => {
  const [bestSellers, setBestSellers] = useState(null);
  const [newProducts, setNewProducts] = useState(null);
  const [activeTab, setActiveTab] = useState(1);
  const [products, setProducts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const settings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "cubic-bezier(0.645, 0.045, 0.355, 1)",
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };
  
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await Promise.all([
        apiGetProducts({ sort: "-sold" }),
        apiGetProducts({ sort: "-createdAt" }),
      ]);
      
      if (response[0]?.success) {
        setBestSellers(response[0].dataProducts || []);
        setProducts(response[0].dataProducts || []);
      } else {
        setBestSellers([]);
        console.error("Failed to fetch best sellers:", response[0]?.message);
      }
      
      if (response[1]?.success) {
        setNewProducts(response[1].dataProducts || []);
      } else {
        setNewProducts([]);
        console.error("Failed to fetch new products:", response[1]?.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setBestSellers([]);
      setNewProducts([]);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  useEffect(() => {
    if (activeTab === 1) setProducts(bestSellers || []);
    if (activeTab === 2) setProducts(newProducts || []);
  }, [activeTab, bestSellers, newProducts]);

  return (
    <div className="w-full">
      {/* Fancy tab header with animated indicator */}
      <div className="flex flex-col relative border-b-0">
        <div className="flex items-center justify-center sm:justify-start gap-8 relative">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`group flex items-center gap-2 py-3 px-6 cursor-pointer relative text-lg font-medium transition-all duration-300 ${activeTab === tab.id ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.name}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600 rounded-t-lg transform transition-transform duration-300 scale-100"></div>
              )}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600 rounded-t-lg transform transition-transform duration-300 scale-x-0 group-hover:scale-x-100"></div>
            </div>
          ))}
        </div>
        
        {/* Decorative heading elements */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2">
          <span className="text-gray-400 text-xs">{activeTab === 1 ? 'Sản phẩm bán chạy nhất' : 'Sản phẩm mới nhất'}</span>
          <div className="w-20 h-0.5 bg-gray-200"></div>
          <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
              <BsStarFill key={star} className="text-yellow-400" size={12} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Products section with enhanced slider */}
      <div className="relative px-6 py-1">
        {isLoading ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-red-600"></div>
            <p className="mt-4 text-gray-500 animate-pulse">Đang tải sản phẩm...</p>
          </div>
        ) : (
          products && products.length > 0 ? (
            <div className="product-slider pb-10">
              <Slider {...settings}>
                {products.map((el) => (
                  <div key={el._id} className="px-2">
                    <Product
                      pid={el._id}
                      productData={el}
                      isNew={activeTab === 2}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          ) : (
            <div className="min-h-[200px] flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="mt-4 text-gray-500">Không tìm thấy sản phẩm</p>
              </div>
            </div>
          )
        )}
      </div>
      
      {/* Banner section with enhanced hover effects */}
      <div className="w-full flex flex-col sm:flex-row gap-6">
        <div className="flex-1 overflow-hidden rounded-lg shadow-md group">
          <img 
            src="https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H2_614x212_8824eb350f.png"
            alt="banner"
            className="w-full h-full object-cover transition-all duration-700"
          />
        </div>
        <div className="flex-1 overflow-hidden rounded-lg shadow-md group">
          <img 
            src="https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H2_614x212_8cda4a9d9f.png"
            alt="banner"
            className="w-full h-full object-cover transition-all duration-700"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(BestSellers);