import React, { memo, useState, useEffect } from "react";
import logo from "assets/logo.png";
import icons from "utils/icons";
import { Link } from "react-router-dom";
import path from "utils/path";
import { useSelector } from "react-redux";
import withBase from "hocs/withBase";
import { showCart } from "store/app/appSlice";
import { apiGetProducts } from "api/product";
import { formatPrice } from "utils/helpers";
import useDebounce from "hooks/useDebounce";

const Header = ({ dispatch, navigate }) => {
  const {
    IoBagHandle,
    FaSearch,
    FaRegHeart,
    FaMapMarkerAlt,
    BsChatDots
  } = icons;
  const { current } = useSelector(state => state.user);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Đà Nẵng");
  const debouncedSearchTerm = useDebounce(searchValue, 500);

  // Determine if user is admin
  const isAdmin = Number(current?.role) === 2010;

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

  // Search for products
  useEffect(() => {
    if (debouncedSearchTerm) {
      const fetchProducts = async () => {
        try {
          const response = await apiGetProducts({
            q: debouncedSearchTerm,
            limit: 20
          });
          if (response.success) {
            setSearchResults(response.dataProducts || []);
            setShowSearchResults(true);
          }
        } catch (error) {
          console.error("Error fetching search results:", error);
          setSearchResults([]);
        }
      };

      fetchProducts();
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [debouncedSearchTerm]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value === '') {
      setShowSearchResults(false);
    }
  };

  const handleSearchFocus = () => {
    setSearchFocused(true);
    if (searchResults.length > 0) {
      setShowSearchResults(true);
    }
  };

  const handleSearchBlur = () => {
    setSearchFocused(false);
    setTimeout(() => {
      setShowSearchResults(false);
    }, 200);
  };

  const handleProductClick = (product) => {
    navigate(`/${product?.category?.toLowerCase()}/${product?._id}/${product?.title}`);
    setShowSearchResults(false);
    setSearchValue("");
  };

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
        <div className={`md:flex items-center max-w-xl w-full mx-8 relative ${searchFocused ? 'ring-2 ring-white' : ''}`}>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full border border-gray-300 rounded-full py-2.5 px-6 focus:outline-none focus:ring-0 text-gray-700"
            value={searchValue}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && searchValue.trim()) {
                navigate(`/products?q=${encodeURIComponent(searchValue)}`);
                setShowSearchResults(false);
              }
            }}
          />
          <button 
            className="absolute right-1 top-1/2 transform -translate-y-1/2 text-white w-8 h-8 flex items-center justify-center bg-red-600 rounded-full hover:bg-red-700 transition-colors"
            onClick={() => {
              if (searchValue.trim()) {
                navigate(`/products?q=${encodeURIComponent(searchValue)}`);
                setShowSearchResults(false);
              }
            }}
          >
            <FaSearch size={14} />
          </button>

          {/* Search Results Dropdown */}
          {showSearchResults && searchResults?.length > 0 && (
            <div className="absolute w-full top-full left-0 mt-1 bg-white border border-gray-300 rounded-2xl shadow-xl z-50 overflow-hidden" onMouseDown={e => e.preventDefault()}>
              <div className="p-3 border-b">
                <h3 className="text-sm font-semibold text-gray-700">
                  Sản phẩm gợi ý
                  <span className="ml-1 text-xs font-normal text-gray-500">
                    (Tìm thấy {searchResults?.length} sản phẩm)
                  </span>
                </h3>
              </div>
              <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {searchResults.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
                    onClick={() => handleProductClick(product)}
                  >
                    {product.thumb && (
                      <img
                        src={product.thumb}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded mr-3"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800">{product.title}</h4>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-red-600">{formatPrice(product.price)}</p>
                        {product.price < product.originalPrice && (
                          <p className="text-xs text-gray-500 line-through">{formatPrice(product.originalPrice)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {searchResults.length >= 10 && (
                <div className="p-2 bg-gray-50 text-center border-t border-gray-200">
                  <button
                    onClick={() => {
                      navigate(`/products?q=${encodeURIComponent(searchValue)}`);
                      setShowSearchResults(false);
                      setSearchValue("");
                    }}
                    className="text-sm text-red-600 hover:text-red-800 font-medium hover:underline transition-colors"
                  >
                    Xem tất cả kết quả
                  </button>
                </div>
              )}
            </div>
          )}

          {/* No Results Message */}
          {showSearchResults && debouncedSearchTerm && searchResults.length === 0 && (
            <div className="absolute w-full top-full left-0 mt-1 bg-white border border-gray-300 rounded-2xl shadow-lg z-50 overflow-hidden p-4 text-center">
              <p className="text-gray-500">Không tìm thấy sản phẩm nào phù hợp với "{debouncedSearchTerm}"</p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          {/* Location - Desktop */}
          <div className="hidden lg:flex items-center gap-2 pr-4 border-r border-gray-200">
            <FaMapMarkerAlt size={16} className="text-red-600" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-600">Vị trí của bạn</span>
              <select
                className="text-sm font-medium text-gray-800 bg-transparent outline-none cursor-pointer"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                <option value="Hà Nội">Hà Nội</option>
              </select>
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
            // onClick={() => dispatch(showChat({ signal: true }))}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors relative cursor-pointer"
            aria-label="Chatbot"
          >
            <BsChatDots size={18} className="text-gray-700" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default withBase(memo(Header));