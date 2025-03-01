import React, { useEffect,useState } from "react";
import { apiGetCategories } from "../api/app";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [categories, setCategories] =  useState(null)
  const fecthCategories = async () => {
    const response = await apiGetCategories();
    if (response.success) setCategories(response.productCategories)
  };
  useEffect(() => {
    fecthCategories();
  }, [])
//   console.log(categories);
  return <div>Sidebar</div>;
};

export default Sidebar;
