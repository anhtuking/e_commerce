import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "components";
import { formatPrice } from "utils/helpers";
import { toast } from "react-toastify";
import {
  FaUser,
  FaCreditCard,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaMoneyBillWave,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import path from "utils/path";
import withBase from "hocs/withBase";

const Checkout = ({ dispatch }) => {
  const navigate = useNavigate();
  const { current } = useSelector((state) => state.user);
  const { currentCart } = useSelector((state) => state.user);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  useEffect(() => {
    const storedCoupon = JSON.parse(localStorage.getItem("applied_coupon"));
    setAppliedCoupon(storedCoupon);
  }, []);

  // State cho thông tin thanh toán với mặc định paymentMethod là "vnpay"
  const [paymentInfo, setPaymentInfo] = useState({
    firstname: current?.firstname || "",
    lastname: current?.lastname || "",
    email: current?.email || "",
    phone: current?.mobile || "",
    address: "",
    city: "",
    district: "",
    ward: "",
    paymentMethod: "vnpay",
    note: "",
  });

  // Kiểm tra giỏ hàng
  useEffect(() => {
    if (!currentCart || currentCart.length === 0) {
      toast.error("Giỏ hàng trống");
      navigate(`/${path.MEMBER}/${path.MY_CART}`);
      return;
    }
  }, [currentCart, navigate]);

  // Tính toán tổng tiền
  const cartTotal = currentCart?.reduce((sum, el) => sum + +el.product?.price * el.quantity, 0) || 0;
  const shippingFee = cartTotal > 2000000 ? 0 : 55000;

  // Tính giảm giá
  const discountPercent = appliedCoupon ? Number(appliedCoupon.discount) : 0;
  const discountAmount = (cartTotal * discountPercent) / 100;
  const orderTotal = cartTotal + shippingFee - discountAmount;



  // Xử lý thay đổi thông tin
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async () => {
    // Kiểm tra các trường bắt buộc
    if (
      !paymentInfo.firstname.trim() ||
      !paymentInfo.lastname.trim() ||
      !paymentInfo.email.trim() ||
      !paymentInfo.phone.trim() ||
      !paymentInfo.address.trim() ||
      !paymentInfo.city.trim() ||
      !paymentInfo.district.trim() ||
      !paymentInfo.ward.trim()
    ) {
      toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc");
      return;
    }
    try {
      // Lưu thông tin vào LocalStorage
      localStorage.setItem(
        "checkout_info",
        JSON.stringify({
          user: current,
          cart: currentCart,
          paymentInfo, // Thêm thông tin địa chỉ giao hàng
        })
      );

      // Gọi API tạo URL thanh toán VNPAY
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/payment/create_payment_url`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: orderTotal }),
        }
      );
      const result = await response.json();

      // Nếu back-end trả về code === '00' và data chính là URL
      if (result.code === "00" && result.data) {
        window.location.href = result.data;
      } else {
        toast.error("Không thể tạo liên kết thanh toán VNPAY");
      }
    } catch (error) {
      console.error("VNPAY payment error:", error);
      toast.error("Có lỗi xảy ra khi kết nối với VNPAY");
    }
  };

  if (!currentCart) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-900 to-pink-800 text-white h-24">
          <div className="w-full mx-auto py-2 px-4 flex flex-col justify-center items-center">
            <h1 className="font-bold uppercase text-3xl md:text-4xl font-main2 mb-2">
              Checkout
            </h1>
            <p className="mt-2 text-gray-100">
              Vui lòng kiểm tra thông tin trước khi thanh toán
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          {/* Thông tin giao hàng */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaUser className="text-red-500" />
                Thông tin giao hàng
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Họ *
                    </label>
                    <input
                      type="text"
                      name="firstname"
                      value={paymentInfo.firstname}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 outline-none"
                      placeholder="Nhập họ"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tên *
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      value={paymentInfo.lastname}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 outline-none"
                      placeholder="Nhập tên"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={paymentInfo.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 outline-none"
                    placeholder="Nhập email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={paymentInfo.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 outline-none"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaLocationDot className="text-red-500" />
                    Địa chỉ giao hàng
                  </h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Địa chỉ chi tiết *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={paymentInfo.address}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 outline-none"
                      placeholder="Nhập địa chỉ chi tiết"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tỉnh/Thành phố *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={paymentInfo.city}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 outline-none"
                        placeholder="Nhập tỉnh/thành phố"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Quận/Huyện *
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={paymentInfo.district}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 outline-none"
                        placeholder="Nhập quận/huyện"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phường/Xã *
                      </label>
                      <input
                        type="text"
                        name="ward"
                        value={paymentInfo.ward}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 outline-none"
                        placeholder="Nhập phường/xã"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ghi chú
                  </label>
                  <textarea
                    name="note"
                    value={paymentInfo.note}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 outline-none"
                    placeholder="Nhập ghi chú (nếu có)"
                  />
                </div>
              </div>
            </div>

            {/* Phương thức thanh toán - chỉ còn VNPAY */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaCreditCard className="text-red-500" />
                Phương thức thanh toán
              </h2>

              <div className="space-y-3">
                <div
                  onClick={() =>
                    setPaymentInfo((prev) => ({
                      ...prev,
                      paymentMethod: "vnpay",
                    }))
                  }
                  className={`flex items-center p-4 rounded-lg cursor-pointer border ${
                    paymentInfo.paymentMethod === "vnpay"
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="vnpay"
                    checked={paymentInfo.paymentMethod === "vnpay"}
                    onChange={handleChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <label className="ml-3 flex items-center gap-2 cursor-pointer flex-1">
                    <img
                      src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"
                      alt="VNPAY"
                      className="w-8 h-8 object-contain"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Thanh toán qua VNPAY
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Tổng quan đơn hàng */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Tổng quan đơn hàng
              </h2>

              <div className="space-y-4">
                {currentCart.map((item) => (
                  <div key={item._id} className="flex items-center gap-4">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Số lượng: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-red-600">
                        {formatPrice(item.product?.price * item.quantity)} VND
                      </p>
                    </div>
                  </div>
                ))}

                <div className="border-t border-gray-200 pt-4">
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm mb-1 text-green-700 font-semibold">
                      <span>Giảm giá:</span>
                      <span>{appliedCoupon.code} (-{formatPrice(discountAmount)} VND)</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(cartTotal)} VND</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>Phí vận chuyển:</span>
                    <span>
                      {shippingFee > 0 ? (
                        `${formatPrice(shippingFee)} VND`
                      ) : (
                        <span className="text-green-500">Miễn phí</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-2 text-main">
                    <span>Tổng cộng:</span>
                    <span>{formatPrice(orderTotal)} VND</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <FaTruck className="text-red-500" size={25} />
                    <span>
                      Miễn phí vận chuyển cho đơn hàng trên 2.000.000 VND
                    </span>
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

                <div className="space-y-3">
                  <Button
                    handleOnClick={handlePlaceOrder}
                    fw
                    className="bg-red-600 hover:bg-red-100 text-white hover:text-red-600 rounded-md font-semibold shadow-sm "
                  >
                    Đặt hàng
                  </Button>

                  <button
                    onClick={() => navigate(`/${path.MEMBER}/${path.MY_CART}`)}
                    className="w-full py-2 px-4 bg-transparent hover:bg-main hover:text-red-50 text-red-600 border-2 border-red-600 rounded-md font-semibold shadow-sm"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withBase(Checkout);