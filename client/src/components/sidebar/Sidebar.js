// components/common/HorizontalCategory.js
import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSlug } from "utils/helpers";
import {
  FaLaptop, 
  FaMobileAlt, 
  FaHeadphones, 
  FaKeyboard,
  FaDesktop,
  FaTabletAlt,
  FaCameraRetro,
  FaGamepad,
  FaClock,
  FaMemory
} from "react-icons/fa";

// Map icons to categories based on category name
const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes('laptop')) return <FaLaptop className="text-xl" />;
  if (name.includes('điện thoại') || name.includes('phone')) return <FaMobileAlt className="text-xl" />;
  if (name.includes('tai nghe') || name.includes('headphone')) return <FaHeadphones className="text-xl" />;
  if (name.includes('keyboard') || name.includes('bàn phím')) return <FaKeyboard className="text-xl" />;
  if (name.includes('monitor') || name.includes('màn hình')) return <FaDesktop className="text-xl" />;
  if (name.includes('tablet') || name.includes('máy tính bảng')) return <FaTabletAlt className="text-xl" />;
  if (name.includes('camera')) return <FaCameraRetro className="text-xl" />;
  if (name.includes('game') || name.includes('gaming')) return <FaGamepad className="text-xl" />;
  if (name.includes('watch') || name.includes('đồng hồ')) return <FaClock className="text-xl" />;
  return <FaMemory className="text-xl" />; // Default icon
};

const HorizontalCategory = () => {
  const categories = useSelector((state) => state.app?.categories);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-5 text-center relative">
        <span className="relative z-10">DANH MỤC SẢN PHẨM</span>
        <span className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-red-200 to-main opacity-30 -z-0"></span>
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories?.map((el) => (
          <NavLink
            key={createSlug(el.title)}
            to={`/${createSlug(el.title)}`}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-red-50 text-main shadow-sm border-l-4 border-main"
                  : "bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-main hover:shadow-sm"
              }`
            }
          >
            <div className="mb-2">
              {getCategoryIcon(el.title)}
            </div>
            <span className="text-center text-sm font-medium whitespace-nowrap">
              {el.title.toUpperCase()}
            </span>
            <span className="text-xs text-gray-500 mt-1">
              {el.brand?.length || 0} thương hiệu
            </span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default HorizontalCategory;
