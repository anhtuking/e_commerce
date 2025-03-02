import React, { useEffect, useState } from "react";
// import { apiGetCategories } from "../api/app";
import { NavLink } from "react-router-dom";
import { createSlug } from "../utils/helpers";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const categories = useSelector((state) => state.app?.categories);
  console.log("Redux State:", categories);
  return (
    <div className="flex flex-col border">
      {categories?.map((el) => (
        <NavLink
          key={createSlug(el.title)}
          to={createSlug(el.title)}
          className={({ isActive }) =>
            isActive
              ? "bg-main text-white px-5 pt-[15px] pb-[14px] text-[15px] hover:text-main"
              : "px-5 pt-[15px] pb-[14px] text-[15px] hover:text-main"
          }
        >
          {el.title}
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
