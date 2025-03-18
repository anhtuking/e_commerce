import React, { memo } from "react";
import { NavLink } from "react-router-dom";
import { createSlug } from "utils/helpers";
import { useSelector } from "react-redux";
import { FaList } from "react-icons/fa"; 

const Sidebar = () => {
  const categories = useSelector((state) => state.app?.categories);
  return (
    
    <div className="flex flex-col border-item bg-white">
      <div className="flex items-center bg-main text-white font-bold text-lg px-4 py-3 uppercase">
        <FaList className="mr-2" /> 
        ALL COLLECTIONS
      </div>
      {categories?.map((el) => (
        <NavLink
          key={createSlug(el.title)}
          to={createSlug(el.title)}
          className={({ isActive }) =>
            isActive
              ? "bg-main text-white px-5 pt-[15px] pb-[14px] text-[15px] hover:text-gray-400"
              : "px-5 pt-[15px] pb-[14px] text-[15px] hover:text-gray-400"
          }
        >
          {el.title}
        </NavLink>
      ))}
    </div>
  );
};

export default memo(Sidebar);
