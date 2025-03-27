import { Button } from 'components'
import OrderItem from 'components/product/OrderItem'
import withBase from 'hocs/withBase'
import { useSelector } from 'react-redux'
import { formatPrice } from 'utils/helpers'
import { BsArrowLeft, BsCartX, BsInfoCircle } from 'react-icons/bs'
import { FaTruck, FaShieldAlt, FaMoneyBillWave, FaGift, FaClipboardCheck, FaUndo, FaInfoCircle } from 'react-icons/fa'
import path from 'utils/path'
import { updateCart } from 'store/user/userSlice'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const DetailCart = ({ location, navigate, dispatch }) => {
  const { currentCart } = useSelector(state => state.user)
  const [promoCode, setPromoCode] = useState('')
  const [promoError, setPromoError] = useState('')

  // Tính tổng tiền
  const cartTotal = currentCart?.reduce((sum, el) => sum + +el.product?.price * el.quantity, 0) || 0
  // Tính phí vận chuyển (miễn phí nếu mua trên 2.000.000 VND)
  const shippingFee = cartTotal > 2000000 ? 0 : 55000
  // Tính tổng đơn hàng
  const orderTotal = cartTotal + shippingFee

  const handlePromoCode = () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code')
      return
    }
    setPromoError('Invalid promo code')
  }

  return (
    <div className='w-full bg-gray-50 min-h-screen pb-20'>
      {/* Cart Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-900 text-white">
        <div className="w-main mx-auto py-10 px-4">
          <h1 className="font-bold uppercase text-3xl md:text-4xl font-main2 mb-2 text-center md:text-left">Your Shopping Cart</h1>
          <div className="flex justify-center md:justify-start">
          </div>
        </div>
      </div>

      <div className='w-[1555px] mx-auto mt-8 px-4'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Cart Items */}
          <div className='flex-1'>
            {currentCart?.length > 0 ? (
              <>
                <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
                  <div className='bg-gradient-to-r from-gray-800 to-gray-700 text-white font-semibold grid grid-cols-10 py-4 px-6'>
                    <span className='col-span-6 w-full'>Product Details</span>
                    <span className='col-span-1 w-full text-center'>Quantity</span>
                    <span className='col-span-3 w-full text-center'>Price</span>
                  </div>

                  <div className='divide-y divide-gray-100'>
                    {currentCart?.map(el => (
                      <OrderItem key={el._id} el={el} defaultQuantity={el.quantity} />
                    ))}
                  </div>
                </div>

                <div className='mt-6 flex flex-col sm:flex-row justify-between items-center gap-4'>
                  <Link
                    to={`/${path.HOME}`}
                    className='flex items-center gap-2 text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 bg-white rounded-md px-4 py-2 shadow-sm'
                  >
                    <BsArrowLeft />
                    <span>Continue shopping</span>
                  </Link>

                  <div className='flex items-center gap-2 text-sm text-gray-600 bg-amber-50 border border-amber-200 px-4 py-2 rounded-md'>
                    <BsInfoCircle className="text-amber-500" />
                    <span>Cart updates automatically when quantity changes</span>
                  </div>
                </div>
              </>
            ) : (
              <div className='bg-white rounded-lg shadow-md p-10 flex flex-col items-center justify-center'>
                <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-6">
                  <BsCartX className='text-5xl text-red-400' />
                </div>
                <h3 className='text-2xl font-bold text-gray-800 mb-2'>Your cart is empty</h3>
                <p className='text-gray-500 mb-8 text-center max-w-md'>
                  Looks like you haven't added any products to your cart yet. Start shopping to find amazing products!
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    handleOnClick={() => navigate(`/${path.HOME}`)}
                    fw
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md shadow-sm"
                  >
                    Browse products
                  </Button>
                  {/* Conditionally render if user is logged in and might have a wishlist */}
                  <Button
                    handleOnClick={() => navigate('/wishlist')}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-md shadow-sm"
                  >
                    View wishlist
                  </Button>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                  <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                    <FaGift className="text-2xl text-red-400 mb-2" />
                    <h4 className="font-medium text-gray-800 mb-1">Special Offers</h4>
                    <p className="text-sm text-gray-600">Discover our latest deals and promotions</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                    <FaTruck className="text-2xl text-red-400 mb-2" />
                    <h4 className="font-medium text-gray-800 mb-1">Fast Delivery</h4>
                    <p className="text-sm text-gray-600">Free shipping on orders over 2.000.000 VND</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                    <FaUndo className="text-2xl text-red-400 mb-2" />
                    <h4 className="font-medium text-gray-800 mb-1">Easy Returns</h4>
                    <p className="text-sm text-gray-600">2 weeks hassle-free return policy</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {currentCart?.length > 0 && (
            <div className='w-full lg:w-[380px]'>
              <div className='bg-white rounded-lg shadow-sm p-6 sticky top-4'>
                <h4 className='text-xl font-bold text-gray-800 border-b pb-4 mb-4'>Order Summary</h4>

                <div className='space-y-4 mb-6'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Subtotal ({currentCart.length} items):</span>
                    <span className='font-medium'>{formatPrice(cartTotal)} VND</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Shipping fee:</span>
                    <span className='font-medium text-green-600'>{shippingFee > 0 ? `${formatPrice(shippingFee)} VND` : 'Free'}</span>
                  </div>
                  {shippingFee > 0 && (
                    <div className='text-sm text-blue-600 flex items-center gap-2 bg-blue-50 p-2 rounded'>
                      <FaInfoCircle className="text-blue-500" />
                      <span>Add {formatPrice(2000000 - cartTotal)} VND more for free shipping</span>
                    </div>
                  )}
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <h5 className="font-medium text-gray-700 mb-2">Promo Code</h5>
                  <div className="flex">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter your code"
                      className="flex-1 py-2 px-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    />
                    <button
                      onClick={handlePromoCode}
                      className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-r-md"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-red-500 text-sm mt-1">{promoError}</p>
                  )}
                </div>

                <div className='border-t border-b py-4 mb-6'>
                  <div className='flex justify-between font-bold'>
                    <span className="text-lg">Total:</span>
                    <span className='text-red-600 text-xl'>{formatPrice(orderTotal)} VND</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Tax included if applicable</p>
                </div>

                <Link
                  to={`/${path.CHECKOUT}`}
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold shadow-sm flex items-center justify-center gap-2 text-xl"
                > Proceed to checkout
                </Link>

                <div className="mt-6 bg-gray-50 p-4 rounded-md">
                  <h5 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <FaClipboardCheck className="text-green-600" />
                    <span>We Guarantee</span>
                  </h5>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-3 text-gray-600'>
                      <FaTruck className='text-red-500 flex-shrink-0' />
                      <span className='text-sm'>Fast delivery in 2-4 days</span>
                    </div>
                    <div className='flex items-center gap-3 text-gray-600'>
                      <FaShieldAlt className='text-red-500 flex-shrink-0' />
                      <span className='text-sm'>12-month product warranty</span>
                    </div>
                    <div className='flex items-center gap-3 text-gray-600'>
                      <FaMoneyBillWave className='text-red-500 flex-shrink-0' />
                      <span className='text-sm'>Secure payment via credit card, bank transfer</span>
                    </div>
                    <div className='flex items-center gap-3 text-gray-600'>
                      <FaUndo className='text-red-500 flex-shrink-0' />
                      <span className='text-sm'>2 weeks easy return policy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default withBase(DetailCart)