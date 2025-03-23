import React, { memo, useState } from 'react'
import withBase from 'hocs/withBase'
import { formatMoney, formatPrice, renderStarFromNumber } from 'utils/helpers'
import icons from 'utils/icons'
import Button from 'components/common/Button'
import { showModal } from 'store/app/appSlice'

const { IoClose, FaMinus, FaPlus } = icons

const QuickView = ({ data, dispatch, navigate }) => {
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(null)

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

            <ul className="space-y-2 mb-6">
              {data?.description?.length > 0 && data?.description?.slice(0, 3).map((item, index) => (
                <li key={index} className="text-sm text-gray-600">{item}</li>
              ))}
            </ul>

            {/* Colors */}
            {(data?.varriants?.length > 0 || data?.color) && (
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

                  {data?.varriants?.map((variant) => (
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
                style="bg-red-900 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Add to cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withBase(memo(QuickView))