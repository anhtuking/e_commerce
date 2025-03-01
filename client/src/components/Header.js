import React from "react";
import logo from "../assets/logo.png";
import icons from "../utils/icons";
import { Link } from "react-router-dom";
import path from "../utils/path";

const Header = () => {
  const { FaPhoneAlt, MdEmail, IoBagHandle, FaUserAlt } = icons;
  return (
    <div className="border w-main flex justify-between h-[120px] py-[35px]">
      <Link to={`/${path.HOME}`}>
        <img src={logo} alt="logo" className="w-[220px] object-contain " />
      </Link>
      <div className="flex text-[13px]">
        <div className="flex flex-col px-8 border-r items-center">
          <span className="flex gap-4 items-center">
            <FaPhoneAlt color="red" />
            <span className="font-semibold">(+84) 000 8386 008</span>
          </span>
          <span>Mon-Sun 8:00AM - 10:00PM</span>
        </div>
        <div className="flex flex-col px-8 border-r items-center">
          <span className="flex gap-4 items-center">
            <MdEmail color="red" />
            <span className="font-semibold">support@digishop.com</span>
          </span>
          <span>Online Support 24/7</span>
        </div>
        <div className="flex items-center justify-center gap-2 px-8 border-r">
          <IoBagHandle color="red" />
          <span> 0 item(s)</span>
        </div>
        <div className="flex items-center justify-center px-8">
          <FaUserAlt size={24} color="red"/>
        </div>
      </div>
    </div>
  );
};

export default Header;
