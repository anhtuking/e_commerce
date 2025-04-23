import React, { memo, useEffect } from "react";
import icons from "utils/icons";
import { Link, useNavigate } from "react-router-dom";
import path from "utils/path";
import { getCurrent } from "store/user/asyncAction";
import { useDispatch, useSelector } from "react-redux";
import { logout, clearMessage } from "store/user/userSlice";
import Swal from "sweetalert2";

const {  
  IoLogOutOutline,
  FaPhoneAlt,
  FaChevronDown,
  FaShippingFast,
  FaCreditCard,
  FaPercentage
} = icons;

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
   }, [mes, navigate, dispatch])
   
  return (
    <div className=" w-full bg-gradient-to-r from-red-900 via-red-800 to-pink-800 text-white backdrop-blur-sm shadow-lg relative z-50">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[200%] bg-gradient-to-br from-yellow-200 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[150%] bg-gradient-to-bl from-red-300 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      {/* Main content */}
      <div className="w-full max-w-[1440px] mx-auto flex justify-between items-center py-2.5 px-6 relative z-10">
        {/* Left side - Announcements */}
        <div className="flex items-center space-x-8">
          <div className="hidden md:flex items-center gap-2 border-r border-red-500/30 pr-8">
            <FaPhoneAlt className="text-yellow-300 animate-pulse" size={14} />
            <span className="text-sm font-medium">Hotline: (+84) 000 8386 008</span>
          </div>
          <div className="flex items-center gap-2 border-r border-red-500/30 pr-8">
            <FaShippingFast className="text-yellow-300" size={16} />
            <span className="text-sm font-medium">Miễn phí vận chuyển cho đơn hàng trên 75$</span>
          </div>
          <div className="hidden md:flex items-center gap-2 border-r border-red-500/30 pr-8">
            <FaCreditCard className="text-yellow-300" size={14} />
            <span className="text-sm">Thanh toán an toàn</span>
          </div>
          <div className="hidden md:flex items-center gap-2 ">
            <FaPercentage className="text-yellow-300" size={14} />
            <span className="text-sm">Khuyến mãi đặc biệt</span>
          </div>
        </div>
        
        {/* Right side - Contact & User */}
        <div className="flex items-center gap-6">
          {/* User Account */}
          {isLoggedIn && current ? (
            <div className="relative group">
              <div className="flex items-center gap-2 cursor-pointer bg-white/10 hover:bg-white/20 transition-all px-4 py-1.5 rounded-full backdrop-blur-sm">
                <span className="text-sm font-medium">{`${current?.firstname} ${current?.lastname}`}</span>
                {current?.role == 2010 && (
                  <span className="bg-blue-500 text-gray-200 text-xs px-1.5 py-0.5 rounded ml-1">Admin</span>
                )}
                <FaChevronDown size={12} className="text-yellow-200 transition-transform group-hover:rotate-180 duration-300" />
              </div>
              
              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-white/90 backdrop-blur-md shadow-xl rounded-xl overflow-hidden z-[1000] invisible group-hover:visible opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 border border-red-100">
                <div className="py-2">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="font-medium text-gray-800">{`${current?.firstname} ${current?.lastname}`}</div>
                    <div className="text-xs text-gray-500">{current?.email}</div>
                  </div>
                  
                  {/* Menu links */}
                  {current?.role == 2010 ? (
                    <>
                      <div className="px-4 py-2 text-xs text-red-600 font-semibold uppercase">Trang quản trị</div>
                      <Link to={`/${path.ADMIN}/${path.DASHBOARD}`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700">
                        <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-700 text-xs">D</span>
                        Trang chủ
                      </Link>
                      <Link to={`/${path.ADMIN}/manage-user`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700">
                        <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-700 text-xs">U</span>
                        Quản lý tài khoản
                      </Link>
                      <Link to={`/${path.ADMIN}/manage-product`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700">
                        <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-700 text-xs">P</span>
                        Quản lý sản phẩm
                      </Link>
                      <Link to={`/${path.ADMIN}/manage-order`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700">
                        <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-700 text-xs">O</span>
                        Quản lý đơn hàng
                      </Link>
                      <Link to={`/${path.ADMIN}/manage-coupon`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700">
                        <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-700 text-xs">P</span>
                        Quản lý khuyến mãi
                      </Link>
                      <Link to={`/${path.ADMIN}/manage-blog`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700">
                        <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-700 text-xs">B</span>
                        Quản lý blogs
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to={`/${path.MEMBER}/${path.PERSONAL}`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700">
                        <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-700 text-xs">A</span>
                        Tài khoản của tôi
                      </Link>
                      <Link to={`/${path.MEMBER}/${path.MY_ORDER}`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700">
                        <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-700 text-xs">O</span>
                        Đơn hàng của tôi
                      </Link>
                      <Link to={`/${path.MEMBER}/${path.WISHLIST}`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700">
                        <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-700 text-xs">W</span>
                        Danh sách yêu thích
                      </Link>
                    </>
                  )}
                  
                  {/* Logout button */}
                  <div onClick={() => dispatch(logout())} className="mt-2 mx-4 mb-3 text-sm">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors">
                      <IoLogOutOutline size={18} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link className='bg-white/10 hover:bg-white/20 transition-all px-4 py-1.5 rounded-full backdrop-blur-sm text-sm font-medium' to={`/${path.LOGIN}`}>
              Đăng nhập / Đăng ký
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(TopHeader);

