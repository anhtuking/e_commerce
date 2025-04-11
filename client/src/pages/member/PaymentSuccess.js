import { apiSavePayment } from "api/payment";
import { apiRemoveCart, apiUpdateCart } from "api/user";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { formatPrice } from "utils/helpers"; 
import { getCurrent } from "store/user/asyncAction";
import { toast } from "react-toastify";
import withBase from "hocs/withBase";
import { useSelector } from "react-redux";

const PaymentSuccess = ({navigate, dispatch}) => {
  const searchParams = new URLSearchParams(window.location.search);
  const [checkoutData, setCheckoutData] = useState(null);
  const requestSent = useRef(false);
  const cartCleared = useRef(false);
  const { current } = useSelector(state => state.user);

  useEffect(() => {
    const data = localStorage.getItem("checkout_info");
    if (data) {
      setCheckoutData(JSON.parse(data));
      localStorage.removeItem("checkout_info");
    } else {
      navigate("/"); // Nếu không có dữ liệu, chuyển hướng về trang chủ
    }
  }, [navigate]);

  // Hàm xóa các sản phẩm đã đặt khỏi giỏ hàng
  const clearCartItems = async (cartItems) => {
    if (!cartItems || cartItems.length === 0 || cartCleared.current) return;
    
    try {
      console.log("Bắt đầu xóa sản phẩm khỏi giỏ hàng...");
      console.log("Số sản phẩm cần xóa:", cartItems.length);
      
      // Nếu user đã đăng nhập và có giỏ hàng
      if (!current) {
        console.log("Người dùng không đăng nhập, không thể xóa giỏ hàng");
        return;
      }
      
      // Phương pháp 1: Gọi API xóa từng sản phẩm
      let successCount = 0;
      let failCount = 0;
      
      const productIds = cartItems.map(item => item.product?._id);
      console.log("Các sản phẩm cần xóa:", productIds);
      
      for (const item of cartItems) {
        const pid = item.product?._id;
        const color = item.color || '';
        
        if (!pid) {
          console.error("Không tìm thấy ID sản phẩm:", item);
          failCount++;
          continue;
        }
        
        try {
          console.log(`Đang xóa sản phẩm: ${pid}, màu: ${color}`);
          
          // Gọi API xóa sản phẩm khỏi giỏ hàng
          const response = await apiRemoveCart(pid, color);
          console.log("Kết quả xóa:", response);
          
          if (response.success) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (err) {
          console.error("Lỗi khi xóa sản phẩm:", err);
          failCount++;
        }
      }
      
      console.log(`Đã xóa thành công ${successCount}/${cartItems.length} sản phẩm`);
      
      // Cập nhật lại thông tin giỏ hàng trong Redux store
      dispatch(getCurrent());
      cartCleared.current = true; // Đánh dấu đã xóa giỏ hàng
      
      if (successCount > 0) {
        toast.success(`Đã xóa ${successCount} sản phẩm khỏi giỏ hàng`);
      } else {
        toast.warning("Không thể xóa sản phẩm khỏi giỏ hàng qua API, vui lòng kiểm tra lại giỏ hàng");
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
      toast.error("Không thể xóa sản phẩm khỏi giỏ hàng");
    }
  };

  const responseCode = searchParams.get("vnp_ResponseCode");
  if (responseCode !== "00") {
    navigate("/")
    Swal.fire({
      title: "Đã hủy",
      text: "Thanh toán đã bị hủy bỏ",
      icon: "error",
      confirmButtonText: "OK",
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/");
      }
    });
  }

  // Lấy thông tin từ VNPAY
  const amount = (searchParams.get("vnp_Amount") || 0) / 100;
  const orderId = searchParams.get("vnp_TxnRef");
  const transactionNo = searchParams.get("vnp_TransactionNo");
  const bankCode = searchParams.get("vnp_BankCode");
  const payDate = searchParams.get("vnp_PayDate");

  // Định dạng ngày
  const formatPayDate = payDate && `
    ${payDate.slice(6, 8)}/
    ${payDate.slice(4, 6)}/
    ${payDate.slice(0, 4)} 
    ${payDate.slice(8, 10)}:
    ${payDate.slice(10, 12)}:
    ${payDate.slice(12, 14)}
  `;

  useEffect(() => {
    if (checkoutData && responseCode === "00" && !requestSent.current) {
      requestSent.current = true; // Đánh dấu đã gửi request

      const paymentData = {
        orderCode: orderId,             // Mã đơn hàng
        transactionCode: transactionNo, // Mã giao dịch
        amount,
        bankCode,
        payDate: formatPayDate,
        userId: checkoutData?.user?._id,
        email: checkoutData?.user?.email,
        phone: checkoutData?.user?.mobile || checkoutData?.paymentInfo?.phone,
        address: `${checkoutData?.paymentInfo.address}, ${checkoutData?.paymentInfo.ward}, ${checkoutData?.paymentInfo.district}, ${checkoutData?.paymentInfo.city}`,
        products: checkoutData?.cart?.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
          title: item.title,
          thumbnail: item.thumbnail,
          color: item.color || ""
        })),
        paymentInfo: checkoutData?.paymentInfo,
        note: checkoutData?.paymentInfo.note || "",  // Lấy ghi chú nếu có
      };
      
      apiSavePayment(paymentData)
        .then((res) => {
          if (res.data.success) {
            console.log("Lưu hóa đơn thành công");
            // Log thông tin giỏ hàng trước khi xóa
            console.log("Dữ liệu giỏ hàng:", checkoutData?.cart);
            // Sau khi lưu hóa đơn thành công, xóa các sản phẩm đã đặt khỏi giỏ hàng
            clearCartItems(checkoutData?.cart);
          } else {
            console.error("Lưu hóa đơn thất bại", res.data);
          }
        })
        .catch((err) => {
          console.error("Có lỗi khi lưu hóa đơn:", err);
        });      
    }
  }, [checkoutData, responseCode, dispatch, orderId, transactionNo, amount, bankCode, formatPayDate, current]);

  if (!checkoutData) return null; // Hiển thị loading hoặc redirect

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Thông báo thành công */}
        <h1 className="text-2xl font-bold text-main mb-6 text-center">
          THANH TOÁN THÀNH CÔNG!
        </h1>

        {/* Thông tin đơn hàng từ VNPAY */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-green-600">Thông tin giao dịch</h2>
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <p>
              <strong>Mã đơn hàng:</strong> {orderId}
            </p>  
            <p>
              <strong>Mã giao dịch:</strong> {transactionNo}
            </p>
            <p>
              <strong>Ngân hàng:</strong> {bankCode}
            </p>
            <p>
              <strong>Số tiền:</strong> {formatPrice(amount)} VND
            </p>
            <p>
              <strong>Thời gian:</strong> {formatPayDate}
            </p>
          </div>
        </div>

        {/* Thông tin người dùng */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-green-600">Thông tin người nhận</h2>
          <div className="space-y-2 text-gray-700">
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <p>
                <strong>Họ tên:</strong> {checkoutData.user?.firstname}{" "}
                {checkoutData.user?.lastname}
              </p>
              <p>
                <strong>Email:</strong> {checkoutData.user?.email}
              </p>
            </div>
            <p>
              <strong>Số điện thoại:</strong> {checkoutData.user?.mobile}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {checkoutData.paymentInfo.address},{" "}
              {checkoutData.paymentInfo.ward},{" "}
              {checkoutData.paymentInfo.district},{" "}
              {checkoutData.paymentInfo.city}
            </p>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-green-600">Sản phẩm đã mua</h2>
          <div className="space-y-4">
            {checkoutData.cart?.map((item) => (
              <div key={item._id} className="flex items-center border-b pb-4">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded mr-4"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-500">
                    Số lượng: {item.quantity}
                  </p>
                  <p className="text-red-600">
                    {formatPrice(item.product?.price * item.quantity)} VND
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nút quay về trang chủ */}
        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="bg-main hover:bg-white hover:text-main text-white px-6 py-2 rounded-md transition-colors"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default withBase(PaymentSuccess);