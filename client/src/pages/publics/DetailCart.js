import { Breadcrumb, Button } from 'components'
import OrderItem from 'components/product/OrderItem'
import withBase from 'hocs/withBase'
import { useSelector } from 'react-redux'
import { formatPrice } from 'utils/helpers'
import { BsCartCheck, BsArrowLeft } from 'react-icons/bs'
import { FaTruck, FaShieldAlt, FaMoneyBillWave } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import path from 'utils/path'

const DetailCart = ({ location }) => {
  const { current } = useSelector(state => state.user)
  const navigate = useNavigate()

  // Tính tổng tiền
  const cartTotal = current?.cart?.reduce((sum, el) => sum + +el.product?.price * el.quantity, 0) || 0
  // Tính phí vận chuyển (miễn phí nếu mua trên 1.000.000 VND)
  const shippingFee = cartTotal > 2000000 ? 0 : 55000
  // Tính tổng đơn hàng
  const orderTotal = cartTotal + shippingFee

  return (
    <div className='w-full bg-gray-50 min-h-screen pb-20'>
      <div className="h-[81px] flex justify-center items-center bg-gray-100">
        <div className="w-main mx-auto py-8">
          <h3 className="font-semibold uppercase text-2xl font-main2">Your Shopping Cart</h3>
          <Breadcrumb category={location.pathname} />
        </div>
      </div>

      <div className='w-main mx-auto mt-8 flex flex-col lg:flex-row gap-8'>
        {/* Phần danh sách sản phẩm */}
        <div className='flex-1'>
          {current?.cart?.length > 0 ? (
            <>
              <div className='bg-white rounded-lg shadow-md overflow-hidden'>
                <div className='bg-gradient-to-r from-red-900 to-pink-800 text-white font-semibold grid grid-cols-10 py-4 px-6'>
                  <span className='col-span-6 w-full'>Product</span>
                  <span className='col-span-1 w-full text-center'>Quantity</span>
                  <span className='col-span-3 w-full text-center'>Price</span>
                </div>

                <div className='divide-y divide-gray-100'>
                  {current?.cart?.map(el => (
                    <OrderItem key={el._id} el={el} />
                  ))}
                </div>
              </div>

              <div className='mt-6 flex justify-between items-center'>
                <button
                  onClick={() => navigate(`/${path.HOME}`)}
                  className='flex items-center gap-2 text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 bg-white rounded-md px-4 py-2 shadow-sm'
                >
                  <BsArrowLeft />
                  <span>Continue shopping</span>
                </button>

                <div className='text-sm text-gray-500 italic'>
                  * Cart is updated automatically when the quantity changes
                </div>
              </div>
            </>
          ) : (
            <div className='bg-white rounded-lg shadow-md p-10 flex flex-col items-center justify-center'>
              <BsCartCheck className='text-8xl text-gray-300 mb-4' />
              <h3 className='text-xl font-semibold text-gray-700 mb-2'>Your cart is empty</h3>
              <p className='text-gray-500 mb-6 text-center'>Please add products to your cart to continue shopping.</p>
              <Button onClick={() => navigate(`/${path.HOME}`)}>Continue shopping</Button>
            </div>
          )}
        </div>

        {/* Phần thông tin thanh toán */}
        {current?.cart?.length > 0 && (
          <div className='w-full lg:w-96'>
            <div className='bg-white rounded-lg shadow-md p-6 sticky top-4'>
              <h4 className='text-lg font-semibold border-b pb-4 mb-4'>Order information</h4>

              <div className='space-y-3 mb-6'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Subtotal:</span>
                  <span className='font-medium'>{formatPrice(cartTotal)} VND</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Shipping fee:</span>
                  <span className='font-medium'>{shippingFee > 0 ? `${formatPrice(shippingFee)} VND` : 'Free'}</span>
                </div>
                {shippingFee > 0 && (
                  <div className='text-xs text-gray-500 italic'>
                    * Free shipping for orders over 2.000.000 VND
                  </div>
                )}
              </div>

              <div className='border-t border-b py-4 mb-6'>
                <div className='flex justify-between font-semibold'>
                  <span>Total:</span>
                  <span className='text-red-600 text-xl'>{formatPrice(orderTotal)} VND</span>
                </div>
              </div>

              <Button fw>Proceed to checkout</Button>

              <div className='mt-6 space-y-3'>
                <div className='flex items-center gap-3 text-gray-600'>
                  <FaTruck className='text-red-500' />
                  <span className='text-sm'>Fast delivery in 2-4 days</span>
                </div>
                <div className='flex items-center gap-3 text-gray-600'>
                  <FaShieldAlt className='text-red-500' />
                  <span className='text-sm'>Product warranty</span>
                </div>
                <div className='flex items-center gap-3 text-gray-600'>
                  <FaMoneyBillWave className='text-red-500' />
                  <span className='text-sm'>Secure payment</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default withBase(DetailCart)