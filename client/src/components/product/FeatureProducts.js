import React, { useState, useEffect, memo } from "react";
import { apiGetProducts } from "api/product";
import { Link } from "react-router-dom";
import { formatPrice, renderStarFromNumber } from "utils/helpers";
import { FaShoppingCart, FaRegEye, FaHeart, FaFilter, FaSearch } from "react-icons/fa";
import { BsArrowRight, BsGrid3X3Gap, BsListUl } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import path from "utils/path";
import { useDispatch } from "react-redux";
import { showModal } from "store/app/appSlice";
import QuickView from "./QuickView";

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "smartphone", label: "Smartphone" },
  { value: "laptop", label: "Laptop" },
  { value: "tablet", label: "Tablet" },
  { value: "accessories", label: "Accessories" },
  { value: "television", label: "Television" },
];

const FeatureProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("-totalRatings");
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleProducts, setVisibleProducts] = useState(10);
  const dispatch = useDispatch();

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
    const response = await apiGetProducts({
        limit: 30,
        sort: sortBy
      });

      if (response && response.success) {
        setProducts(response.dataProducts || []);
        setFilteredProducts(response.dataProducts || []);
      } else {
        console.error("Failed to fetch featured products:", response?.message);
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error("Error fetching featured products:", error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter products based on category, sort criteria, and search term
  useEffect(() => {
    let result = [...products];
    
    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter(product => 
        product.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      result = result.filter(product => 
        product.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProducts(result);
  }, [activeCategory, products, searchTerm]);

  // Fetch products when sort criteria changes
  useEffect(() => {
    fetchProducts();
  }, [sortBy]);

  const loadMoreProducts = () => {
    setVisibleProducts(prev => prev + 5);
  };

  // Settings for the promotional banner slider
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  // Product Card component for grid view
  const ProductCardGrid = ({ product }) => {
    
    const handleQuickView = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(showModal({
        isShowModal: true,
        modalChildren: <QuickView data={product} />
      }));
    };
    
    return (
      <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
        <div className="relative pt-[100%] overflow-hidden">
          <img
            src={product.thumb}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Overlay with quick actions */}
          <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex gap-2">
              <button 
                onClick={handleQuickView}
                className="w-10 h-10 rounded-full bg-white text-gray-700 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
              >
                <FaRegEye size={16} />
              </button>
              <button 
                onClick={() => window.location.href = `/${product.category.toLowerCase()}/${product._id}/${product.title}?add=cart`}
                className="w-10 h-10 rounded-full bg-white text-gray-700 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
              >
                <FaShoppingCart size={16} />
              </button>
              <button 
                onClick={() => window.location.href = `/${product.category.toLowerCase()}/${product._id}/${product.title}?add=wishlist`}
                className="w-10 h-10 rounded-full bg-white text-gray-700 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
              >
                <FaHeart size={16} />
              </button>
            </div>
          </div>
          
          {/* Sale badge if there's a discount */}
          {product.price < product.originalPrice && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </div>
          )}
          
          {/* New badge if product is recent */}
          {new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
            <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
              NEW
            </div>
          )}
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center text-yellow-400 mb-1">
            {renderStarFromNumber(product.totalRatings, 14)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.ratings?.length || 0})</span>
          </div>
          
          <Link 
            to={`/${product.category.toLowerCase()}/${product._id}/${product.title}`}
            className="font-medium text-gray-800 hover:text-red-600 transition-colors line-clamp-2 min-h-[48px]"
          >
            {product.title}
          </Link>
          
          <div className="mt-auto pt-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-red-600">{formatPrice(product.price)} VND</span>
                {product.price < product.originalPrice && (
                  <span className="text-xs text-gray-500 line-through block">{formatPrice(product.originalPrice)} VND</span>
                )}
              </div>
              <span className="text-xs text-gray-500">Sold: {product.sold}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Product Card component for list view
  const ProductCardList = ({ product }) => (
    <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex h-full">
      <div className="relative w-1/3 overflow-hidden">
        <img
          src={product.thumb}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Sale badge if there's a discount */}
        {product.price < product.originalPrice && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow w-2/3">
        <div className="flex items-center text-yellow-400 mb-1">
          {renderStarFromNumber(product.totalRatings, 14)?.map((el, index) => (
            <span key={index}>{el}</span>
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.ratings?.length || 0})</span>
        </div>
        
        <Link 
          to={`/${product.category.toLowerCase()}/${product._id}/${product.title}`}
          className="font-medium text-gray-800 hover:text-red-600 transition-colors"
        >
          {product.title}
        </Link>
        
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description?.[0] || 'No description available'}</p>
        
        <div className="mt-auto pt-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-red-600">{formatPrice(product.price)} VND</span>
              {product.price < product.originalPrice && (
                <span className="text-xs text-gray-500 line-through ml-2">{formatPrice(product.originalPrice)} VND</span>
              )}
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => window.location.href = `/${product.category.toLowerCase()}/${product._id}/${product.title}?add=cart`}
                className="p-2 rounded bg-gray-100 text-gray-700 hover:bg-red-600 hover:text-white transition-colors"
              >
                <FaShoppingCart size={16} />
              </button>
              <button 
                onClick={() => window.location.href = `/${product.category.toLowerCase()}/${product._id}/${product.title}?add=wishlist`}
                className="p-2 rounded bg-gray-100 text-gray-700 hover:bg-red-600 hover:text-white transition-colors"
              >
                <FaHeart size={16} />
              </button>
              <Link 
                to={`/${product.category.toLowerCase()}/${product._id}/${product.title}`}
                className="p-2 rounded bg-gray-100 text-gray-700 hover:bg-red-600 hover:text-white transition-colors"
              >
                <FaRegEye size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-main pb-2">
          SẢN PHẨM NỔI BẬT
        </h3>
        <Link 
          to={`/${path.PRODUCTS}`} 
          className="flex items-center gap-1 text-gray-600 hover:text-main transition-colors"
        >
          Xem tất cả sản phẩm
          <BsArrowRight />
        </Link>
      </div>
      
      {/* Banner slider */}
      <div className="mb-6">
        <Slider {...sliderSettings}>
          <div className="relative">
            <img 
              src="https://hc.com.vn/i/ecommerce/media/11585647_BANNER_DESKTOP_IMAGE_1_165287.jpg" 
              alt="Promotion 1" 
              className="w-full h-[200px] md:h-[300px] object-cover rounded-lg"
            />
          </div>
          <div className="relative">
            <img 
              src="https://hc.com.vn/i/ecommerce/media/11585647_BANNER_DESKTOP_IMAGE_1_164242.jpg" 
              alt="Promotion 2" 
              className="w-full h-[200px] md:h-[300px] object-cover rounded-lg"
            />
          </div>
          <div className="relative">
            <img 
              src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/7a/de/7adece1c51d94f081fa52342199742db.png" 
              alt="Promotion 3" 
              className="w-full h-[200px] md:h-[300px] object-cover rounded-lg"
            />
          </div>
        </Slider>
      </div>
      
      {/* Filtering and view options */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Category filter */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map(category => (
                <button
                  key={category.value}
                  onClick={() => setActiveCategory(category.value)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    activeCategory === category.value 
                      ? 'bg-main text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Right side controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 w-full focus:outline-none focus:border-main"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            
            {/* View mode toggles */}
            <div className="flex border rounded-lg overflow-hidden">
              <button 
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-main text-white' : 'bg-gray-100 text-gray-700'}`}
                aria-label="Grid view"
              >
                <BsGrid3X3Gap />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-main text-white' : 'bg-gray-100 text-gray-700'}`}
                aria-label="List view"
              >
                <BsListUl />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products display */}
      {isLoading ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main"></div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <>
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4' 
            : 'space-y-4'
          }>
            {filteredProducts.slice(0, visibleProducts).map(product => (
              viewMode === 'grid' 
                ? <ProductCardGrid key={product._id} product={product} />
                : <ProductCardList key={product._id} product={product} />
            ))}
          </div>
          
          {/* Load more button */}
          {visibleProducts < filteredProducts.length && (
            <div className="flex justify-center mt-8">
              <button 
                onClick={loadMoreProducts}
                className="flex items-center gap-2 bg-white border border-gray-300 hover:border-main hover:bg-main hover:text-white text-gray-700 px-6 py-2 rounded-full shadow-sm transition-colors"
              >
                <IoMdAddCircleOutline size={20} />
                <span>Tải thêm sản phẩm</span>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="min-h-[300px] flex flex-col items-center justify-center bg-white rounded-lg p-8">
          <FaFilter className="text-gray-300 text-5xl mb-4" />
          <h4 className="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy sản phẩm</h4>
          <p className="text-gray-500">Hãy thay đổi các bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}
      
      {/* Extra promotional banners */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-bottom-home2_b96bc752-67d4-45a5-ac32-49dc691b1958_600x.jpg?v=1613166661"
          alt="Promotion"
          className="w-full h-full object-cover rounded-lg md:col-span-2 row-span-2"
        />
          <img
            src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-bottom-home2_400x.jpg?v=1613166661"
          alt="Promotion"
          className="w-full h-full object-cover rounded-lg md:col-span-1 row-span-1"
        />
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner4-bottom-home2_92e12df0-500c-4897-882a-7d061bb417fd_400x.jpg?v=1613166661"
          alt="Promotion"
          className="w-full h-full object-cover rounded-lg md:col-span-1 row-span-2"
        />
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner3-bottom-home2_400x.jpg?v=1613166661"
          alt="Promotion"
          className="w-full h-full object-cover rounded-lg md:col-span-1 row-span-1"
        />
      </div>
    </div>
  );
};

export default memo(FeatureProducts);
