import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "components";
import { formatPrice } from "utils/helpers";
import { FaTruck, FaUndo, FaMoneyBillWave, FaShieldAlt } from "react-icons/fa";
import path from "utils/path";

const OrderSummary = ({
  selectedProducts = [],
  appliedCoupon,
  cartTotal = 0,
  shippingFee = 0,
  discountAmount = 0,
  orderTotal = 0,
  handlePlaceOrder,
  handleGoBackToCart,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Tổng quan đơn hàng
      </h2>

      <div className="space-y-4">
        {/* Danh sách sản phẩm đã chọn */}
        <div className="mb-4 border-b pb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Sản phẩm đã chọn ({selectedProducts.length})
          </h3>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {selectedProducts.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-md border border-gray-200 shadow-sm"
                    />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800 line-clamp-1">
                      {item.title}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.product?.color}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-bold text-red-600 whitespace-nowrap">
                  {formatPrice(item.product?.price * item.quantity)} VND
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tổng tiền */}
        <div className="border-t border-gray-200 pt-4">
          {appliedCoupon && (
            <div className="flex justify-between text-sm mb-2 bg-green-50 p-2 rounded-md">
              <span className="font-medium text-green-700">Mã giảm giá:</span>
              <div className="flex flex-col items-end">
                <span className="font-semibold text-green-700">
                  {appliedCoupon.code}
                </span>
                <span className="text-green-600">
                  -{formatPrice(discountAmount)} VND
                </span>
              </div>
            </div>
          )}
          <div className="flex justify-between text-sm text-gray-600 py-2">
            <span>Tạm tính:</span>
            <span>{formatPrice(cartTotal)} VND</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 py-2 border-b border-gray-100">
            <span>Phí vận chuyển:</span>
            <span>
              {shippingFee > 0 ? (
                `${formatPrice(shippingFee)} VND`
              ) : (
                <span className="text-green-500 font-medium">Miễn phí</span>
              )}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold mt-3 py-2 text-red-600 bg-gray-50 p-2 rounded-md">
            <span>Tổng cộng:</span>
            <span>{formatPrice(orderTotal)} VND</span>
          </div>
        </div>

        {/* Thông tin thêm */}
        <div className="bg-gray-50 p-4 rounded-lg flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <FaTruck className="text-red-500" size={25} />
            <span>Miễn phí vận chuyển cho đơn hàng trên 2.000.000 VND</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaUndo className="text-red-500" size={20} />
            <span>Đảm bảo hoàn tiền trong 30 ngày theo qui định</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaMoneyBillWave className="text-red-500" size={30} />
            <span>
              Thanh toán an toàn qua thẻ tín dụng, chuyển khoản ngân hàng
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaShieldAlt className="text-red-500" size={20} />
            <span>Bảo hành sản phẩm 12 tháng theo chính sách</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Button
            handleOnClick={handlePlaceOrder}
            fw
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-sm py-3 transition-all duration-200"
          >
            Đặt hàng
          </Button>

          <button
            onClick={handleGoBackToCart || (() => navigate(`/${path.MEMBER}/${path.MY_CART}`))}
            className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-red-600 border border-red-600 rounded-lg font-medium shadow-sm transition-all duration-200"
          >
            Quay lại giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary; 