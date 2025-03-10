import React, { memo, useEffect } from "react";
import icons from "../utils/icons";
import { Link } from "react-router-dom";
import path from "../utils/path";
import { getCurrent } from "../store/user/asyncAction";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/user/userSlice";

const { FaFacebook, FaFacebookMessenger, FaTwitter, FaInstagramSquare, FaGoogle, IoLogOutOutline  } = icons;

const TopHeader = () => {
  const dispatch = useDispatch()
  const {isLoggedIn, current} = useSelector(state => state.user)
  useEffect(() => {
    if (isLoggedIn) dispatch(getCurrent())
  }, [dispatch, isLoggedIn])
  return (
    <div className="bg-main2 text-white text-sm h-[40px] flex items-center justify-center w-full">
      <div className="flex items-center justify-between w-main">
        <span>ORDER ONLINE OR CALL US (+84) 000 8386 008</span>
        <div className="flex items-center gap-3">
          {isLoggedIn 
          ? <div className="flex gap-4 text-sm font-main2 items-center">
            <span onClick={() => dispatch(logout())} className="hover:rounded-full hover:bg-gray-200 p-2 hover:text-main2 cursor-pointer"><IoLogOutOutline size={18}/></span>
            <span>{`Welcome ${current?.lastname} ${current?.firstname}`}</span>
          </div>
          : <Link className='hover:text-gray-600 hover:underline' to={`/${path.LOGIN}`}>
          Login or Register
        </Link>
          }
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
