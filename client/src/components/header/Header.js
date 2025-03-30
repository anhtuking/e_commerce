import React, { memo, useState, useEffect } from "react";
import logo from "assets/logo.png";
import icons from "utils/icons";
import { Link } from "react-router-dom";
import path from "utils/path";
import { useSelector } from "react-redux";
import withBase from "hocs/withBase";
import { showCart } from "store/app/appSlice";

const Header = ({dispatch}) => {
  const { 
    IoBagHandle, 
    FaSearch,
    FaRegHeart,
    FaMapMarkerAlt,
    SiChatbot
  } = icons;
  const { current } = useSelector(state => state.user);
  // const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  // Determine if user is admin
  const isAdmin = Number(current?.role) === 2010;
  console.log('Is admin?', isAdmin);  
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  
  return (
    <div className={`sticky top-0 w-full z-30 bg-white transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
      {/* Main header */}
      <div className="w-full max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to={`/${path.HOME}`} className="flex-shrink-0 relative z-10">
          <img 
            src={logo} 
            alt="Marseille" 
            className="h-16 object-contain transform hover:scale-105 transition-transform duration-300" 
          />
        </Link>
        
        {/* Search bar - larger screens */}
        <div className={` md:flex items-center max-w-xl w-full mx-8 relative ${searchFocused ? 'ring-2 ring-red-400' : ''}`}>
          <input 
            type="text" 
            placeholder="Search for products..." 
            className="w-full border border-gray-300 rounded-full py-2.5 px-6 focus:outline-none text-gray-700"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <button className="absolute right-1 top-1/2 transform -translate-y-1/2 text-white w-8 h-8 flex items-center justify-center bg-red-600 rounded-full hover:bg-red-700 transition-colors">
            <FaSearch size={14} />
          </button>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-3">
          {/* Location - Desktop */}
          <div className="hidden lg:flex items-center gap-2 pr-4 border-r border-gray-200">
            <FaMapMarkerAlt size={16} className="text-red-600" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-600">Your Location</span>
              <span className="text-sm font-medium text-gray-800">Da Nang City</span>
            </div>
          </div>
          
          {/* Wishlist button */}
          <Link 
            to={`/${path.MEMBER}/${path.WISHLIST}`} 
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors relative"
            aria-label="Wishlist"
          >
            <FaRegHeart size={18} className="text-gray-700" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">{`${current?.wishlist?.length || 0}`}</span>
          </Link>
          
          {/* Cart button */}
          <div 
            onClick={() => dispatch(showCart())}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors relative cursor-pointer"
            aria-label="Shopping Cart"
          >
            <IoBagHandle size={20} className="text-gray-700" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">{`${current?.cart?.length || 0}`}</span>
          </div>

          {/* Chatbot button */}
          <Link 
            to={`/${path.CHATBOT_DETAILS}`}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors relative cursor-pointer"
            aria-label="Shopping Cart"
          >
            <SiChatbot size={20} className="text-gray-700" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default withBase(memo(Header));
