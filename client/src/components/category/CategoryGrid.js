import React from "react";
import { NavLink } from "react-router-dom";
import { productCategories } from "../../utils/contants";

const CategoryGrid = () => {
  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center mb-4">
        <h3 className="text-base font-semibold text-gray-700">Danh mục sản phẩm</h3>
        <div className="flex-grow h-px bg-gray-200 ml-2"></div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {productCategories.map((category) => (
          <NavLink
            key={category.slug}
            to={`/${category.slug}`}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center p-2 rounded-md transition-all duration-300 hover:shadow ${
                isActive ? "border-b-2 border-main" : ""
              }`
            }
          >
            <div className="flex items-center justify-center w-16 h-16 mb-2">
              <img 
                src={category.image}
                alt={category.title}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-center text-xs font-medium">
              {category.title}
            </span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid; 