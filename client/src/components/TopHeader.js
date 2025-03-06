import React, { memo } from "react";
import icons from "../utils/icons";
import { Link } from "react-router-dom";
import path from "../utils/path";

const { FaFacebook, FaFacebookMessenger, FaTwitter, FaInstagramSquare, FaGoogle } = icons;

const TopHeader = () => {
  return (
    <div className="bg-main text-white text-sm h-[40px] flex items-center justify-center w-full">
      <div className="flex items-center justify-between w-main">
        <span>ORDER ONLINE OR CALL US (+84) 000 8386 008</span>
        <div className="flex items-center gap-3">
          <Link className='hover:text-gray-600 hover:underline' to={`/${path.LOGIN}`}>
            Sign In or Sign Up
          </Link>
          <a href="https://www.facebook.com/duongvan.anhtu.7">
            <FaFacebook />
          </a>
          <FaFacebookMessenger />
          <a href="https://x.com/marcuslouiss012">
            <FaTwitter />
          </a>
          <FaInstagramSquare />
          <FaGoogle />
        </div>
      </div>
    </div>
  );
};

export default memo(TopHeader);
