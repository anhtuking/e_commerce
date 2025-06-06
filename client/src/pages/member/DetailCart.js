import { Button } from 'components'
import OrderItem from 'components/product/OrderItem'
import withBase from 'hocs/withBase'
import { useSelector } from 'react-redux'
import { formatPrice } from 'utils/helpers'
import { BsArrowLeft, BsCartX, BsInfoCircle, BsCartCheck } from 'react-icons/bs'
import { FaTruck, FaShieldAlt, FaMoneyBillWave, FaGift, FaClipboardCheck, FaUndo, FaInfoCircle, FaLock, FaTag, FaTrash } from 'react-icons/fa'
import path from 'utils/path'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { apiValidateCoupon } from 'api/coupon'
import { toast } from 'react-toastify'

const DetailCart = ({ location, navigate, dispatch }) => {
  const { currentCart } = useSelector(state => state.user)
  const [promoCode, setPromoCode] = useState('')
  const [promoError, setPromoError] = useState('')
  const [selectedItems, setSelectedItems] = useState([])
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [isValidating, setIsValidating] = useState(false)

  // Khi vào trang giỏ hàng, đọc các mục đã chọn từ localStorage
  useEffect(() => {
    const storedSelectedItems = JSON.parse(localStorage.getItem("selected_cart_items")) || [];
    setSelectedItems(storedSelectedItems);
  }, []);

  // Khi vào trang cart mới, xóa localStorage nếu không có sản phẩm nào được chọn
  useEffect(() => {
    if (selectedItems.length === 0) {
      localStorage.removeItem("selected_cart_items");
    }
  }, [selectedItems]);

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) => {
      let updated;
      if (prev.includes(itemId)) {
        updated = prev.filter((id) => id !== itemId);
      } else {
        updated = [...prev, itemId];
      }
      if (updated.length === 0) {
        localStorage.removeItem("selected_cart_items");
      } else {
        localStorage.setItem("selected_cart_items", JSON.stringify(updated));
      }
      return updated;
    });
  };
  

  // Tính tổng tiền
  const selectedCart = currentCart?.filter(el => selectedItems.includes(el._id)) || [];
  const cartTotal = selectedCart.reduce((sum, el) => sum + (+el.product?.price * el.quantity), 0);
  const shippingFee = cartTotal > 2000000 ? 0 : 55000;
  
  // Tính giảm giá
  const discountPercent = appliedCoupon ? Number(appliedCoupon.discount) : 0;
  const discountAmount = (cartTotal * discountPercent) / 100;
  const orderTotal = cartTotal + shippingFee - discountAmount;

  const handlePromoCode = async () => {
    // Lấy danh sách sản phẩm đã chọn từ localStorage
    const selectedCartItems = JSON.parse(localStorage.getItem("selected_cart_items")) || [];
  
    if (selectedCartItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm trong giỏ hàng");
      return;
    }
  
    if (!promoCode.trim()) {
      setPromoError('Vui lòng nhập mã khuyến mãi');
      localStorage.removeItem("applied_coupon"); 
      return;
    }
    
    setIsValidating(true);
    setPromoError('');
  
    try {
      const response = await apiValidateCoupon({ name: promoCode });
      if (response.success) {
        setAppliedCoupon(response.coupon);
        toast.success('Áp dụng mã giảm giá thành công!');
        setPromoCode('');
        localStorage.setItem("applied_coupon", JSON.stringify(response.coupon));
      } else {
        setPromoError(response.mes || 'Mã giảm giá không hợp lệ');
        localStorage.removeItem("applied_coupon"); 
      }      
    } catch (error) {
      setPromoError(error.mes || 'Đã xảy ra lỗi khi kiểm tra mã giảm giá');
      localStorage.removeItem("applied_coupon");
    } finally {
      setIsValidating(false);
    }
  };
  

  useEffect(() => {
    // Nếu không có coupon nào được áp dụng trong state, xóa key khỏi localStorage.
    if (!appliedCoupon) {
      localStorage.removeItem("applied_coupon");
    }
  }, [appliedCoupon]);  

  const removeCoupon = () => {
    setAppliedCoupon(null)
    toast.success('Đã hủy mã giảm giá')
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-x-hidden">
      <div className="pl-4 mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                Giỏ hàng của tôi
              </span>
            </h1>
            <p className="text-gray-600">
              Quản lý giỏ hàng và cập nhật giỏ hàng của bạn
            </p>
          </div>
        </div>
      </div>

      <div className='w-full max-w-[1555px] mx-auto mt-8 px-4'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Cart Items */}
          <div className='flex-1'>
            {currentCart?.length > 0 ? (
              <>
                <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100'>
                  <div className='bg-gradient-to-r from-red-900 to-pink-900 text-white font-semibold grid grid-cols-10 py-4 px-6'>
                    <span className='col-span-1'>Chọn</span>
                    <span className='col-span-5'>Chi tiết sản phẩm</span>
                    <span className='col-span-1 text-center'>Số lượng</span>
                    <span className='col-span-3 text-center'>Giá</span>
                  </div>

                  <div className='divide-y divide-gray-100'>  
                    {currentCart?.map(el => (
                      <OrderItem 
                        key={el._id} 
                        el={el} 
                        defaultQuantity={el.quantity}
                        selected={selectedItems.includes(el._id)}
                        onSelect={() => handleSelectItem(el._id)}
                      />
                    ))}
                  </div>
                </div>

                <div className='mt-6 flex flex-col sm:flex-row justify-between items-center gap-4'>
                  <Link
                    to={`/${path.PRODUCTS}`}
                    className='flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors duration-200 bg-white rounded-lg px-5 py-3 shadow-sm border border-gray-100 hover:border-red-200 hover:bg-red-50'
                  >
                    <BsArrowLeft className="text-lg" />
                    <span className="font-medium">Tiếp tục mua hàng</span>
                  </Link>

                  <div className='flex items-center gap-2 text-sm text-gray-600 bg-red-50 border border-red-200 px-4 py-3 rounded-lg'>
                    <BsInfoCircle className="text-red-500" />
                    <span>Giỏ hàng cập nhật tự động khi số lượng thay đổi</span>
                  </div>
                </div>
              </>
            ) : (
              <div className='bg-white rounded-xl shadow-sm p-12 flex flex-col items-center justify-center border border-gray-100'>
                <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-6">
                  <BsCartX className='text-5xl text-red-400' />
                </div>
                <h3 className='text-2xl font-bold text-gray-800 mb-3'>Giỏ hàng của bạn trống</h3>
                <p className='text-gray-500 mb-8 text-center max-w-md'>
                  Có vẻ như bạn chưa thêm sản phẩm vào giỏ hàng của mình. Bắt đầu mua hàng để tìm kiếm sản phẩm tuyệt vời!
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    handleOnClick={() => navigate(`/${path.PRODUCTS}`)}
                    fw
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg shadow-sm"
                  >
                    Xem sản phẩm
                  </Button>
                  <Button
                    handleOnClick={() => navigate(`/${path.WISHLIST}`)}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-lg shadow-sm"
                  >
                    Xem danh sách yêu thích
                  </Button>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                  <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md hover:bg-gray-50/80 transition-all duration-300">
                    <FaGift className="text-3xl text-red-500 mb-3" />
                    <h4 className="font-medium text-gray-800 mb-2">Khuyến mãi đặc biệt</h4>
                    <p className="text-sm text-gray-600">Khám phá các khuyến mãi và ưu đãi mới nhất</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md hover:bg-gray-50/80 transition-all duration-300">
                    <FaTruck className="text-3xl text-red-500 mb-3" />
                    <h4 className="font-medium text-gray-800 mb-2">Giao hàng nhanh</h4>
                    <p className="text-sm text-gray-600">Miễn phí vận chuyển trên đơn hàng trên 2.000.000 VND</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md hover:bg-gray-50/80 transition-all duration-300">
                    <FaUndo className="text-3xl text-red-500 mb-3" />
                    <h4 className="font-medium text-gray-800 mb-2">Trả hàng dễ dàng</h4>
                    <p className="text-sm text-gray-600">Chính sách trả hàng miễn phí trong 2 tuần</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {currentCart?.length > 0 && (
            <div className='w-full lg:w-[400px]'>
              <div className='bg-white rounded-xl shadow-sm p-6 sticky top-4 border border-gray-100'>
                <h4 className='text-xl font-bold text-gray-800 border-b pb-4 mb-5 flex items-center'>
                  <BsCartCheck className="text-red-600 mr-2" />
                  Tóm tắt đơn hàng
                </h4>

                <div className='space-y-4 mb-6'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Tổng tiền ({selectedCart.length} sản phẩm):</span>
                    <span className='font-medium'>{formatPrice(cartTotal)} VND</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className='flex justify-between text-green-600'>
                      <span>Giảm giá ({appliedCoupon.discount}%):</span>
                      <span>-{formatPrice(discountAmount)} VND</span>
                    </div>
                  )}

                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Phí vận chuyển:</span>
                    <span className={`font-medium ${shippingFee > 0 ? 'text-gray-800' : 'text-green-600'}`}>
                      {shippingFee > 0 ? `${formatPrice(shippingFee)} VND` : 'Miễn phí'}
                    </span>
                  </div>
                  
                  {shippingFee > 0 && (
                    <div className='text-sm flex items-start gap-2 bg-red-50 p-3 rounded-lg'>
                      <FaInfoCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-red-700">
                        Thêm <span className="font-semibold">{formatPrice(2000000 - cartTotal)} VND</span> để được 
                        <span className="text-green-600 font-semibold"> miễn phí vận chuyển</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                    <FaTag className="text-red-500 mr-2" />
                    Mã giảm giá
                  </h5>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                      <div>
                        <span className="font-medium text-green-700">{appliedCoupon.name}</span>
                        <p className="text-sm text-green-600">Giảm {appliedCoupon.discount}% tổng giá trị đơn hàng</p>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          placeholder="Nhập mã giảm giá"
                          className="flex-1 py-3 px-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          disabled={isValidating}
                        />
                        <button
                          onClick={handlePromoCode}
                          className={`${
                            isValidating 
                              ? 'bg-gray-400' 
                              : 'bg-gray-800 hover:bg-gray-700'
                          } text-white px-4 py-3 rounded-r-lg font-medium flex items-center`}
                          disabled={isValidating}
                        >
                          {isValidating ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Đang kiểm tra...
                            </>
                          ) : (
                            'Áp dụng'
                          )}
                        </button>
                      </div>
                      {promoError && (
                        <p className="text-red-500 text-sm mt-2">{promoError}</p>
                      )}
                    </>
                  )}
                </div>

                <div className='border-t border-b py-5 mb-6'>
                  <div className='flex justify-between font-bold'>
                    <span className="text-lg text-gray-800">Tổng cộng:</span>
                    <span className='text-red-600 text-xl'>{formatPrice(orderTotal)} VND</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Thuế đã bao gồm nếu có</p>
                </div>

                <Link
                  to={`/${path.CHECKOUT}`}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <FaLock className="text-sm" />
                  <span className="text-lg">Tiếp tục thanh toán</span>
                </Link>

                <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h5 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <FaClipboardCheck className="text-green-600" />
                    <span>Chúng tôi cam kết</span>
                  </h5>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-3 text-gray-600'>
                      <FaTruck className='text-red-500 flex-shrink-0' />
                      <span className='text-sm'>Giao hàng nhanh trong 2-4 ngày</span>
                    </div>
                    <div className='flex items-center gap-3 text-gray-600'>
                      <FaShieldAlt className='text-red-500 flex-shrink-0' />
                      <span className='text-sm'>Bảo hành sản phẩm 12 tháng</span>
                    </div>
                    <div className='flex items-center gap-3 text-gray-600'>
                      <FaMoneyBillWave className='text-red-500 flex-shrink-0' />
                      <span className='text-sm'>Thanh toán an toàn qua thẻ tín dụng, chuyển khoản ngân hàng, hoặc thanh toán khi nhận hàng</span>
                    </div>
                    <div className='flex items-center gap-3 text-gray-600'>
                      <FaUndo className='text-red-500 flex-shrink-0' />
                      <span className='text-sm'>Chính sách trả hàng dễ dàng trong 2 tuần</span>
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