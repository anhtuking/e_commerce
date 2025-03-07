import React from "react";
import { NavLink } from "react-router-dom";
import { createSlug } from "../utils/helpers";
import { useSelector } from "react-redux";
import { FaList } from "react-icons/fa"; 

const Sidebar = () => {
  const categories = useSelector((state) => state.app?.categories);
  // console.log("Redux State:", categories);
  return (
    
    <div className="flex flex-col border bg-[#e4e4e4]">
      <div className="flex items-center bg-main2 text-white font-bold text-lg px-4 py-3 uppercase">
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

export default Sidebar;
