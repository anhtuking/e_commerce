import React from "react";
import { FaCreditCard } from "react-icons/fa";

const PaymentMethod = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FaCreditCard className="text-red-500" />
        Phương thức thanh toán
      </h2>

      <div className="space-y-4">
        <div className="flex items-center bg-red-50 p-4 rounded-lg border-2 border-red-500 shadow-md">
          <div className="flex items-center gap-2">
            <img
              src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"
              alt="vnpay"
              className="w-12 h-10"
            />
            <span className="text-gray-700 font-medium">Thanh toán qua VNPay</span>
          </div>
          <div className="ml-auto">
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-medium text-red-800 mb-2">Thông tin thanh toán</h3>
          <p className="text-sm text-gray-700">
            Sau khi nhấn "Đặt hàng", bạn sẽ được chuyển đến trang thanh toán VNPAY
            để hoàn tất giao dịch.
          </p>
          <p className="text-sm text-gray-700 mt-2">VNPAY hỗ trợ thanh toán qua:</p>
          <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
            <li>Thẻ ATM nội địa</li>
            <li>Thẻ tín dụng/ghi nợ quốc tế</li>
            <li>Ví điện tử</li>
            <li>QR Code</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod; 