import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { apiGetProducts } from 'api/product'
import { apiUpdateCart, apiUpdateWishlist } from 'api/user'
import { getCurrent } from 'store/user/asyncAction'
import { Breadcrumb, Button } from 'components'
import withBase from 'hocs/withBase'
import { formatPrice } from 'utils/helpers'
import { 
  BsHeartFill, 
  BsArrowLeft, 
  BsCartPlus, 
  BsInfoCircle, 
  BsXCircle,
  BsHeart
} from 'react-icons/bs'
import { 
  FaHeart, 
  FaTruck, 
  FaBox, 
  FaTags, 
  FaSearch, 
  FaStar, 
  FaShoppingCart,
  FaFilter,
  FaExclamationCircle
} from 'react-icons/fa'
import path from 'utils/path'
import { Link } from 'react-router-dom'

const Wishlist = ({ location, navigate }) => {
  const dispatch = useDispatch()
  const { current } = useSelector(state => state.user)
  const [wishlistProducts, setWishlistProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (current?.wishlist?.length > 0) {
        setIsLoading(true)
        try {
          const response = await apiGetProducts({
            limit: 100,
            page: 1
          })
          
          if (response.success) {
            // Lọc các sản phẩm có trong wishlist
            const wishlistItems = response.dataProducts.filter(product => 
              current.wishlist.includes(product._id)
            )
            setWishlistProducts(wishlistItems)
          }
        } catch (error) {
          console.error('Error fetching wishlist products:', error)
          toast.error('Could not fetch your wishlist items')
        } finally {
          setIsLoading(false)
        }
      } else {
        setWishlistProducts([])
      }
    }
    
    fetchWishlistProducts()
  }, [current?.wishlist])

  const handleAddToCart = async (product) => {
    try {
      const response = await apiUpdateCart({
        pid: product._id,
        color: product.color || 'Default',
        quantity: 1,
        price: product.price,
        thumbnail: product.thumb,
        title: product.title
      })
      
      if (response.success) {
        toast.success('Added to cart!')
        dispatch(getCurrent())
      } else {
        toast.error(response.mes)
      }
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const handleRemoveFromWishlist = async (pid) => {
    try {
      const response = await apiUpdateWishlist(pid)
      if (response.success) {
        toast.success('Removed from wishlist')
        dispatch(getCurrent())
      } else {
        toast.error(response.mes)
      }
    } catch (error) {
      toast.error('Failed to remove from wishlist')
    }
  }

  const filteredProducts = wishlistProducts.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='w-full min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20'>
      {/* Header */}
      <div className="pl-6 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className='mt-6'>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                Danh sách yêu thích
              </span>
            </h1>
            <p className="text-gray-600">
              Quản lý danh sách yêu thích của bạn
            </p>
          </div>
        </div>
      </div>

      <div className='w-[1555px] mx-auto mt-8 px-4'>
        {/* Wishlist Control Panel */}
        <div className="mb-8">
          <div className="w-full bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <BsHeartFill className="text-red-500 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">{current?.wishlist?.length || 0} Sản phẩm đã lưu</h3>
                  <p className="text-sm text-gray-500">Các sản phẩm đã lưu</p>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="relative w-full md:w-auto md:min-w-[300px]">
                <input
                  type="text"
                  placeholder="Tìm kiếm trong danh sách yêu thích..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              <Link
                to={`/${path.HOME}`}
                className='hidden md:flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors duration-200 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:border-red-200 hover:bg-red-50'
              >
                <BsArrowLeft />
                <span className="font-medium">Tiếp tục mua hàng</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        <div>
          {isLoading ? (
            <div className="w-full bg-white rounded-xl shadow-sm p-12 border border-gray-100 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
              <p className="text-gray-500">Đang tải danh sách yêu thích...</p>
            </div>
          ) : wishlistProducts.length > 0 ? (
            <>
              {searchTerm && (
                <div className="mb-6 bg-red-50 p-4 rounded-lg border border-red-100 flex items-center gap-3 text-red-700">
                  <BsInfoCircle className="flex-shrink-0" />
                  <span>
                    Hiển thị {filteredProducts.length} kết quả cho "{searchTerm}"
                    {filteredProducts.length !== wishlistProducts.length && (
                      <> out of {wishlistProducts.length} sản phẩm</>
                    )}
                  </span>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <div key={product._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 group">
                    {/* Product Image and Actions */}
                    <div className="relative">
                      <Link to={`/${product?.category?.toLowerCase()}/${product?._id}/${product?.title}`}>
                        <div className="aspect-square overflow-hidden">
                          <img 
                            src={product.thumb} 
                            alt={product.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </Link>
                      
                      <div className="absolute top-3 right-3 z-10">
                        <button 
                          onClick={() => handleRemoveFromWishlist(product._id)}
                          className="w-9 h-9 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-red-500 hover:text-white hover:bg-red-500 transition-all duration-300 shadow-sm"
                          title="Remove from wishlist"
                        >
                          <BsXCircle size={18} />
                        </button>
                      </div>
                      
                      {product.price < (product.originalPrice || product.price * 1.2) && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          {Math.round((1 - product.price / (product.originalPrice || product.price * 1.2)) * 100)}% OFF
                        </div>
                      )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400 mr-1">
                          {Array(5).fill(0).map((_, index) => (
                            <FaStar 
                              key={index} 
                              className={index < Math.round(product?.totalRatings || 0) ? 'text-yellow-400' : 'text-gray-200'} 
                              size={14} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">({product?.ratings?.length || 0})</span>
                      </div>
                      
                      <Link to={`/${product?.category?.toLowerCase()}/${product?._id}/${product?.title}`}>
                        <h3 className="font-medium text-gray-800 hover:text-red-600 transition-colors mb-2 line-clamp-2 h-12">{product.title}</h3>
                      </Link>
                      
                      <div className="flex justify-between items-end mt-3">
                        <div>
                          <div className="font-bold text-red-600">{formatPrice(product.price)} VND</div>
                          {product.price < (product.originalPrice || product.price * 1.2) && (
                            <div className="text-xs line-through text-gray-500">{formatPrice(product.originalPrice || product.price * 1.2)} VND</div>
                          )}
                        </div>
                        
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600 p-2 rounded-lg transition-colors"
                          title="Add to cart"
                        >
                          <BsCartPlus size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Mobile Continue Shopping Button */}
              <div className="mt-8 md:hidden">
                <Link
                  to={`/${path.HOME}`}
                  className='flex items-center justify-center gap-2 font-medium text-gray-700 hover:text-red-600 bg-white p-3 rounded-lg shadow-sm border border-gray-200'
                >
                  <BsArrowLeft />
                  <span>Tiếp tục mua hàng</span>
                </Link>
              </div>
            </>
          ) : (
            <div className='bg-white rounded-xl shadow-sm p-12 flex flex-col items-center justify-center border border-gray-100'>
              <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-6">
                <BsHeart className='text-4xl text-red-300' />
              </div>
              <h3 className='text-2xl font-bold text-gray-800 mb-3'>Danh sách yêu thích của bạn trống</h3>
              <p className='text-gray-500 mb-8 text-center max-w-md'>
                Bắt đầu thêm sản phẩm vào danh sách yêu thích bằng cách nhấp vào biểu tượng trái tim trên sản phẩm mà bạn thích.
              </p>
              <Button 
                handleOnClick={() => navigate(`/${path.HOME}`)}
                fw
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg shadow-sm"
              >
                Khám phá sản phẩm
              </Button>
              
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md hover:bg-gray-50/80 transition-all duration-300">
                  <FaTags className="text-3xl text-red-400 mb-3" />
                  <h4 className="font-medium text-gray-800 mb-2">Lưu yêu thích</h4>
                  <p className="text-sm text-gray-600">Tạo một bộ sưu tập các sản phẩm mà bạn thích</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md hover:bg-gray-50/80 transition-all duration-300">
                  <FaBox className="text-3xl text-red-400 mb-3" />
                  <h4 className="font-medium text-gray-800 mb-2">Theo dõi tình trạng</h4>
                  <p className="text-sm text-gray-600">Giữ một mắt để mua sau</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md hover:bg-gray-50/80 transition-all duration-300">
                  <FaTruck className="text-3xl text-red-400 mb-3" />
                  <h4 className="font-medium text-gray-800 mb-2">Mua nhanh</h4>
                  <p className="text-sm text-gray-600">Dễ dàng thêm vào giỏ hàng khi bạn sẵn sàng</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Recommendations Section */}
        {wishlistProducts.length > 0 && (
          <div className="mt-16 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <FaFilter className="text-red-500 mr-2" />
                Đề xuất cho bạn
              </h3>
              
              <Link to={`/${path.PRODUCTS}`} className="text-red-600 hover:text-red-700 font-medium flex items-center">
                Xem tất cả sản phẩm
                <BsArrowLeft className="ml-1 rotate-180" />
              </Link>
            </div>
            
            <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
              <FaExclamationCircle className="text-3xl text-gray-300 mb-4" />
              <p className="text-center text-gray-500">Các sản phẩm đề xuất sẽ xuất hiện ở đây</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default withBase(Wishlist)