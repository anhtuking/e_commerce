import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import path from "utils/path";
import withBase from "hocs/withBase";
import OrderSummary from "../../components/checkout/OrderSummary";
import ShippingInfo from "../../components/checkout/ShippingInfo";
import PaymentMethod from "../../components/checkout/PaymentMethod";

// Custom CSS for the scrollbar
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #999;
  }
`;

const Checkout = ({ dispatch }) => {
  const navigate = useNavigate();
  const { current } = useSelector((state) => state.user);
  const { currentCart } = useSelector((state) => state.user);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [selectedCartItems, setSelectedCartItems] = useState([]);
  
  // Add the scrollbar style to document head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = scrollbarStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Lấy danh sách sản phẩm đã chọn từ localStorage
  useEffect(() => {
    const selectedItems = JSON.parse(localStorage.getItem("selected_cart_items")) || [];
    setSelectedCartItems(selectedItems);
    
    // Kiểm tra chặt chẽ hơn: Nếu không có sản phẩm nào được chọn, 
    // xóa localStorage và quay lại trang giỏ hàng
    if (selectedItems.length === 0) {
      localStorage.removeItem("selected_cart_items");
      toast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      navigate(`/${path.MEMBER}/${path.MY_CART}`);
      return;
    }
  }, [navigate]);
  
  useEffect(() => {
    const storedCoupon = localStorage.getItem("applied_coupon");
    if (storedCoupon) {
      try {
        const parsedCoupon = JSON.parse(storedCoupon);
        // Kiểm tra xem coupon có key hợp lệ (discount) hay không
        if (parsedCoupon && parsedCoupon.discount) {
          setAppliedCoupon(parsedCoupon);
        } else {
          setAppliedCoupon(null);
          localStorage.removeItem("applied_coupon");
        }
      } catch (error) {
        console.error("Lỗi parse coupon", error);
        setAppliedCoupon(null);
        localStorage.removeItem("applied_coupon");
      }
    } else {
      setAppliedCoupon(null);
    }
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

  // State để quản lý lỗi form
  const [formErrors, setFormErrors] = useState({});

  // Kiểm tra giỏ hàng
  useEffect(() => {
    if (!currentCart || currentCart.length === 0) {
      toast.error("Giỏ hàng trống");
      navigate(`/${path.MEMBER}/${path.MY_CART}`);
      return;
    }
  }, [currentCart, navigate]);

  // Lọc các sản phẩm đã chọn từ giỏ hàng
  const selectedProducts = currentCart?.filter(item => selectedCartItems.includes(item._id)) || [];
  
  // Tính tổng tiền của các sản phẩm đã chọn
  const cartTotal = selectedProducts?.reduce((sum, el) => sum + +el.product?.price * el.quantity, 0) || 0;
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
    
    // Xóa lỗi khi người dùng chỉnh sửa trường
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Hàm validate form
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    
    if (!paymentInfo.firstname.trim()) errors.firstname = "Vui lòng nhập họ";
    if (!paymentInfo.lastname.trim()) errors.lastname = "Vui lòng nhập tên";
    
    if (!paymentInfo.email.trim()) {
      errors.email = "Vui lòng nhập email";
    } else if (!emailRegex.test(paymentInfo.email)) {
      errors.email = "Email không hợp lệ";
    }
    
    if (!paymentInfo.phone.trim()) {
      errors.phone = "Vui lòng nhập số điện thoại";
    } else if (!phoneRegex.test(paymentInfo.phone)) {
      errors.phone = "Số điện thoại không hợp lệ";
    }
    
    if (!paymentInfo.address.trim()) errors.address = "Vui lòng nhập địa chỉ";
    if (!paymentInfo.city.trim()) errors.city = "Vui lòng chọn tỉnh/thành phố";
    if (!paymentInfo.district.trim()) errors.district = "Vui lòng chọn quận/huyện";
    if (!paymentInfo.ward.trim()) errors.ward = "Vui lòng chọn phường/xã";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async () => {
    // Lấy danh sách sản phẩm đã chọn từ localStorage
    const selectedCartItems = JSON.parse(localStorage.getItem("selected_cart_items")) || [];
  
    if (selectedCartItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm trong giỏ hàng");
      return;
    }
  
    // Validate form
    const isValid = validateForm();
    if (!isValid) {
      toast.error("Vui lòng kiểm tra lại thông tin nhập vào");
      // Scroll lên đầu trang để người dùng thấy lỗi
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  
    try {
      // Lưu thông tin thanh toán vào LocalStorage kèm theo các sản phẩm đã chọn
      localStorage.setItem(
        "checkout_info",
        JSON.stringify({
          user: current,
          // Chỉ lưu các sản phẩm mà người dùng đã chọn
          cart: currentCart.filter(item => selectedCartItems.includes(item._id)),
          paymentInfo,
          appliedCoupon,
          orderTotal
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

      if (result.code === "00" && result.data) {
        window.location.href = result.data;
      } else {
        toast.error("Không thể tạo liên kết thanh toán VNPAY");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Có lỗi xảy ra khi xử lý thanh toán");
    }
  };
  
  // Hàm được gọi khi click vào nút "Quay lại giỏ hàng"
  const handleGoBackToCart = () => {
    // Không xóa selected_cart_items ở đây, sẽ xử lý trong DetailCart
    navigate(`/${path.MEMBER}/${path.MY_CART}`);
  };

  if (!currentCart) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-900 to-pink-800 text-white h-24">
          <div className="w-full mx-auto py-2 px-4 flex flex-col justify-center items-center">
            <h1 className="font-bold uppercase text-3xl md:text-4xl font-main2 mb-2">
              Thanh toán
            </h1>
            <p className="mt-2 text-gray-100">
              Vui lòng kiểm tra thông tin trước khi thanh toán
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          {/* Cột thông tin bên trái */}
          <div className="lg:col-span-2">
            {/* Thông tin giao hàng */}
            <ShippingInfo 
              paymentInfo={paymentInfo}
              handleChange={handleChange}
              formErrors={formErrors}
            />

            {/* Phương thức thanh toán */}
            <PaymentMethod />
          </div>

          {/* Cột tổng quan đơn hàng bên phải */}
          <div className="lg:col-span-1">
            <OrderSummary
              selectedProducts={selectedProducts}
              appliedCoupon={appliedCoupon}
              cartTotal={cartTotal}
              shippingFee={shippingFee}
              discountAmount={discountAmount}
              orderTotal={orderTotal}
              handlePlaceOrder={handlePlaceOrder}
              handleGoBackToCart={handleGoBackToCart}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withBase(Checkout);