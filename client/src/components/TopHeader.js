import React, { memo } from "react";
import icons from "../utils/icons";

const { FaFacebook, FaFacebookMessenger, FaTwitter, FaInstagramSquare, FaGoogle } = icons;

const TopHeader = () => {
  return (
    <div className="bg-red-500 text-white text-sm py-2 flex justify-between px-10">
      <div className="flex items-center gap-4">
        <span>ORDER ONLINE OR CALL US (+84) 000 8386 008</span>
        <div className="relative">
          <select className="bg-red-600 text-white border-none cursor-pointer">
            <option value="en">English</option>
            <option value="vi">Vietnamese</option>
            <option value="fr">France</option>
          </select>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <a href="https://www.facebook.com/duongvan.anhtu.7">
          <FaFacebook/>
        </a>
        <FaFacebookMessenger/>
        <a href="https://x.com/marcuslouiss012">
          <FaTwitter/>
        </a>
        <FaInstagramSquare/>
        <FaGoogle/>
      </div>
    </div>
  );
};

export default memo(TopHeader);
