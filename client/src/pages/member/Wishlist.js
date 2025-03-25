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
  BsXCircle 
} from 'react-icons/bs'
import { 
  FaHeart, 
  FaTruck, 
  FaBox, 
  FaTags, 
  FaSearch, 
  FaStar, 
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
    <div className='w-full bg-gray-50 min-h-screen pb-20'>
      {/* Wishlist Header */}
      <div className="bg-gradient-to-r from-pink-600 to-red-600 text-white">
        <div className="w-main mx-auto py-10 px-4">
          <h1 className="font-bold uppercase text-3xl md:text-4xl font-main2 mb-2 text-center md:text-left">My Wishlist</h1>
          <div className="flex justify-center md:justify-start">
            <Breadcrumb category="Wishlist" />
          </div>
        </div>
      </div>

      <div className='w-main mx-auto mt-8 px-4'>
        {/* Wishlist Stats */}
        <div className="mb-8">
          <div className="w-full bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <BsHeartFill className="text-red-500 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{current?.wishlist?.length || 0} Saved Items</h3>
                  <p className="text-sm text-gray-500">Items you've added to your wishlist</p>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="relative w-full md:w-auto md:min-w-[300px]">
                <input
                  type="text"
                  placeholder="Search in wishlist..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              <Link
                to={`/${path.HOME}`}
                className='hidden md:flex items-center gap-2 text-gray-700 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 bg-white rounded-md px-4 py-2 shadow-sm'
              >
                <BsArrowLeft />
                <span>Continue shopping</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        <div>
          {isLoading ? (
            <div className="w-full bg-white rounded-lg shadow-sm p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : wishlistProducts.length > 0 ? (
            <>
              {searchTerm && (
                <div className="mb-4 bg-blue-50 p-3 rounded-md flex items-center gap-2 text-blue-700">
                  <BsInfoCircle />
                  <span>
                    Showing {filteredProducts.length} results for "{searchTerm}"
                    {filteredProducts.length !== wishlistProducts.length && (
                      <> out of {wishlistProducts.length} items</>
                    )}
                  </span>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                    {/* Product Image and Actions */}
                    <div className="relative">
                      <Link to={`/${product?.category?.toLowerCase()}/${product?._id}/${product?.title}`}>
                        <img 
                          src={product.thumb} 
                          alt={product.title} 
                          className="w-full h-full object-cover"
                        />
                      </Link>
                      
                      <div className="absolute top-0 right-0 bg-white bg-opacity-90 rounded-bl-lg p-2">
                        <button 
                          onClick={() => handleRemoveFromWishlist(product._id)}
                          className="text-red-500 hover:text-red-700"
                          title="Remove from wishlist"
                        >
                          <BsXCircle size={20} />
                        </button>
                      </div>
                      
                      {product.price < product.originalPrice && (
                        <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg">
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </div>
                      )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="p-4">
                      <div className="flex items-center mb-1">
                        <div className="flex text-yellow-400 mr-1">
                          {Array(5).fill(0).map((_, index) => (
                            <FaStar 
                              key={index} 
                              className={index < Math.floor(product?.totalRatings || 0) ? 'text-yellow-400' : 'text-gray-300'} 
                              size={12} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">({product?.ratings?.length || 0})</span>
                      </div>
                      
                      <Link to={`/${product?.category?.toLowerCase()}/${product?._id}/${product?.title}`}>
                        <h3 className="font-medium text-gray-800 mb-1 line-clamp-2 h-12">{product.title}</h3>
                      </Link>
                      
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="font-bold text-red-600">{formatPrice(product.price)} VND</div>
                          {product.price < product.originalPrice && (
                            <div className="text-xs line-through text-gray-500">{formatPrice(product.originalPrice)} VND</div>
                          )}
                        </div>
                        
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full transition-colors"
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
                  className='flex items-center justify-center gap-2 text-gray-700 hover:text-red-500 bg-white p-3 rounded-md shadow-sm'
                >
                  <BsArrowLeft />
                  <span>Continue shopping</span>
                </Link>
              </div>
            </>
          ) : (
            <div className='bg-white rounded-lg shadow-md p-10 flex flex-col items-center justify-center'>
              <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-6">
                <FaHeart className='text-4xl text-red-200' />
              </div>
              <h3 className='text-2xl font-bold text-gray-800 mb-2'>Your wishlist is empty</h3>
              <p className='text-gray-500 mb-8 text-center max-w-md'>
                Start adding items to your wishlist by clicking the heart icon on products you love.
              </p>
              <Button 
                handleOnClick={() => navigate(`/${path.HOME}`)}
                fw
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md shadow-sm"
              >
                Explore products
              </Button>
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                  <FaTags className="text-2xl text-red-400 mb-2" />
                  <h4 className="font-medium text-gray-800 mb-1">Save Favorites</h4>
                  <p className="text-sm text-gray-600">Create a collection of items you love</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                  <FaBox className="text-2xl text-red-400 mb-2" />
                  <h4 className="font-medium text-gray-800 mb-1">Track Availability</h4>
                  <p className="text-sm text-gray-600">Keep an eye on products to buy later</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                  <FaTruck className="text-2xl text-red-400 mb-2" />
                  <h4 className="font-medium text-gray-800 mb-1">Quick Purchasing</h4>
                  <p className="text-sm text-gray-600">Easily add to cart when you're ready</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Recently Viewed or Featured Products */}
        {wishlistProducts.length > 0 && (
          <div className="mt-12 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recommended for you</h3>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="text-center text-gray-500">Recommended products would appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default withBase(Wishlist)