import React, { memo, useState } from 'react'
import withBase from 'hocs/withBase'
import { formatMoney, formatPrice, renderStarFromNumber, addToCartUtil } from 'utils/helpers'
import icons from 'utils/icons'
import Button from 'components/common/Button'
import { showModal } from 'store/app/appSlice'
import { apiUpdateCart } from 'api/user'
import { toast } from 'react-toastify'
import { getCurrent } from 'store/user/asyncAction'
import Swal from 'sweetalert2'
import path from 'utils/path'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import DOMPurify from 'dompurify'

const { IoClose, FaMinus, FaPlus } = icons

const QuickView = ({ data, dispatch, navigate }) => {
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { current } = useSelector(state => state.user)
  const location = useLocation()

  const handleChangeQuantity = (type) => {
    if (type === 'minus' && quantity > 1) setQuantity(prev => prev - 1)
    if (type === 'plus') setQuantity(prev => prev + 1)
  }

  const handleClose = (e) => {
    e.stopPropagation()
    dispatch(showModal({ isShowModal: false, modalChildren: null }))
  }

  const handleViewDetail = () => {
    dispatch(showModal({ isShowModal: false, modalChildren: null }))
    navigate(`/${data?.category?.toLowerCase()}/${data?._id}/${data?.title}`)
  }

  const handleAddToCart = async () => {
    if (!current) return Swal.fire({
      title: 'Wait...',
      text: 'Please login to add to cart',
      icon: 'info',
      confirmButtonText: 'Login',
      denyButtonText: 'Cancel',
      showDenyButton: true,
      confirmButtonColor: '#3085d6',
    }).then(async (result) => {
      if (result.isConfirmed) {
        handleClose({ stopPropagation: () => {} })
        navigate(`/${path.LOGIN}?redirect=${location.pathname}`)
      }
    })

    setIsAddingToCart(true)
    
    // Lấy thông tin biến thể được chọn (nếu có)
    const selectedVariant = selectedColor ? data?.variants?.find(el => el.sku === selectedColor) : null
    
    // Sử dụng hàm addToCartUtil để tạo dữ liệu giỏ hàng
    const cartData = addToCartUtil(data, quantity, selectedVariant)
    
    const response = await apiUpdateCart(cartData)
    
    setIsAddingToCart(false)
    
    if (response.success) {
      toast.success(response.mes)
      dispatch(getCurrent())
      // Đóng modal sau khi thêm thành công
      handleClose({ stopPropagation: () => {} })
    } else {
      toast.error(response.mes)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="bg-overlay absolute inset-0"></div>
      <div className="bg-white w-[850px] max-h-[90vh] z-10 rounded-md overflow-auto relative" onClick={e => e.stopPropagation()}>
        <div className="absolute top-3 right-3 z-10">
          <IoClose
            size={24}
            className="cursor-pointer hover:text-red-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleClose(e);
            }}
          />

        </div>

        <div className="flex">
          {/* Product Image */}
          <div className="w-[450px] p-6 flex items-center justify-center">
            <img
              src={data?.thumb || "https://apollobattery.com.au/wp-content/uploads/2022/08/default-product-image.png"}
              alt={data?.title}
              className="max-w-full max-h-[400px] object-contain"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 p-6 border-l">
            <h2 className="text-xl font-medium mb-4">{data?.title}</h2>
            <div className="text-xl font-semibold text-red-600 mb-2">
              {`${formatPrice(formatMoney(data?.price))} VND`}
            </div>

            <div className="flex items-center gap-2 mb-4">
              {renderStarFromNumber(data?.totalRatings)?.map((el, index) => (
                <span key={index}>{el}</span>
              ))}
            </div>

            <div className="mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              <h3 className="font-medium mb-2">Description:</h3>
              {data?.description ? (
                Array.isArray(data.description) ? (
                  <ul className="space-y-2">
                    {data.description.slice(0, 15).map((item, index) => (
                      <li key={index} className="text-sm text-gray-600 whitespace-pre-line">{item}</li>
                    ))}
                    {data.description.length > 15 && (
                      <li className="text-sm italic text-gray-500">... và nhiều thông tin khác</li>
                    )}
                  </ul>
                ) : (
                  <div 
                    className="text-sm text-gray-600 line-clamp-15 whitespace-pre-line" 
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.description) }}
                  />
                )
              ) : (
                <p className="text-sm text-gray-500 italic">Không có mô tả sản phẩm</p>
              )}
            </div>

            {/* Colors */}
            {(data?.variants?.length > 0 || data?.color) && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Color:</h3>
                <div className="flex gap-2">
                  {data?.color && (
                    <div
                      className={`border p-1 cursor-pointer ${!selectedColor ? 'border-red-500' : ''}`}
                      onClick={() => setSelectedColor(null)}
                    >
                      <div className="flex items-center gap-2">
                        <img src={data?.thumb} alt="thumb" className="w-8 h-8 object-cover" />
                        <span className="text-sm">{data?.color}</span>
                      </div>
                    </div>
                  )}

                  {data?.variants?.map((variant) => (
                    <div
                      key={variant.sku}
                      className={`border p-1 cursor-pointer ${selectedColor === variant.sku ? 'border-red-500' : ''}`}
                      onClick={() => setSelectedColor(variant.sku)}
                    >
                      <div className="flex items-center gap-2">
                        <img src={variant.thumb} alt="variant" className="w-8 h-8 object-cover" />
                        <span className="text-sm">{variant.color}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <h3 className="font-medium">Quantity:</h3>
              <div className="flex items-center">
                <button
                  className="w-8 h-8 flex items-center justify-center border border-gray-300"
                  onClick={() => handleChangeQuantity('minus')}
                >
                  <FaMinus size={12} />
                </button>
                <input
                  type="text"
                  value={quantity}
                  className="w-10 h-8 outline-none text-center border-t border-b border-gray-300"
                  readOnly
                />
                <button
                  className="w-8 h-8 flex items-center justify-center border border-gray-300"
                  onClick={() => handleChangeQuantity('plus')}
                >
                  <FaPlus size={12} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                handleOnClick={handleViewDetail}
                style="bg-blue-900 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                See details
              </Button>
              <Button
                handleOnClick={handleAddToCart}
                style="bg-red-900 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                disabled={isAddingToCart}
              >
                {isAddingToCart ? 'Adding...' : 'Add to cart'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withBase(memo(QuickView))