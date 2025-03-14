import React, { memo, useEffect } from "react";
import icons from "utils/icons";
import { Link, useNavigate } from "react-router-dom";
import path from "utils/path";
import { getCurrent } from "store/user/asyncAction";
import { useDispatch, useSelector } from "react-redux";
import { logout, clearMessage } from "store/user/userSlice";
import Swal from "sweetalert2";

const { FaFacebook, FaFacebookMessenger, FaTwitter, FaInstagramSquare, FaGoogle, IoLogOutOutline  } = icons;

const TopHeader = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {isLoggedIn, current, mes} = useSelector(state => state.user)
  useEffect(() => {
    const setTimeoutId = setTimeout(() => { 
      if (isLoggedIn) dispatch(getCurrent())
     }, 300)
    return () => { 
      clearTimeout(setTimeoutId)
     }
  }, [dispatch, isLoggedIn])

  useEffect(() => { 
    if (mes) Swal.fire('Oops!', mes, 'info').then(() => { 
      dispatch(clearMessage())
      navigate(`/${path.LOGIN}`)
     })
   }, [mes, navigate])
  return (
    <div className="bg-main2 text-white text-sm h-[40px] flex items-center justify-center w-full">
      <div className="flex items-center justify-between w-main">
        <span>ORDER ONLINE OR CALL US (+84) 000 8386 008</span>
        <div className="flex items-center gap-3">
          {isLoggedIn && current
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
