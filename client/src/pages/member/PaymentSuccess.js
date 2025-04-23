// src/pages/PaymentSuccess.js

import { apiSavePayment } from "api/payment";
import { apiRemoveCart } from "api/user";
import { getCurrent } from "store/user/asyncAction";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { formatPrice } from "utils/helpers";
import withBase from "hocs/withBase";

const PaymentSuccess = ({ navigate }) => {
  const dispatch = useDispatch();
  const { current } = useSelector((state) => state.user);
  const searchParams = new URLSearchParams(window.location.search);
  const responseCode = searchParams.get("vnp_ResponseCode");

  const [checkoutData, setCheckoutData] = useState(null);
  const requestSent = useRef(false);

  // 1) Load checkout info từ localStorage
  useEffect(() => {
    const data = localStorage.getItem("checkout_info");
    if (data) {
      setCheckoutData(JSON.parse(data));
      localStorage.removeItem("checkout_info");
    } else {
      navigate("/");
    }
  }, [navigate]);

  // 2) Nếu thanh toán bị hủy
  useEffect(() => {
    if (responseCode && responseCode !== "00") {
      Swal.fire({
        title: "Đã hủy",
        text: "Thanh toán đã bị hủy bỏ",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      }).then(() => navigate("/"));
    }
  }, [responseCode, navigate]);

  // 3) Khi thành công: lưu hóa đơn và xoá sản phẩm khỏi cart
  useEffect(() => {
    if (!checkoutData || responseCode !== "00" || requestSent.current) return;
    requestSent.current = true;

    // Build payload cho hóa đơn
    const paymentData = {
      orderCode: searchParams.get("vnp_TxnRef"),
      transactionCode: searchParams.get("vnp_TransactionNo"),
      amount: (searchParams.get("vnp_Amount") || 0) / 100,
      bankCode: searchParams.get("vnp_BankCode"),
      payDate: (() => {
        const pd = searchParams.get("vnp_PayDate") || "";
        return pd
          ? `${pd.slice(6, 8)}/${pd.slice(4, 6)}/${pd.slice(0, 4)} ${pd.slice(
              8,
              10
            )}:${pd.slice(10, 12)}:${pd.slice(12, 14)}`
          : "";
      })(),
      userId: checkoutData.user._id,
      email: checkoutData.user.email,
      phone: checkoutData.paymentInfo.phone,
      address: [
        checkoutData.paymentInfo.address,
        checkoutData.paymentInfo.ward,
        checkoutData.paymentInfo.district,
        checkoutData.paymentInfo.city,
      ]
        .filter(Boolean)
        .join(", "),
      products: checkoutData.cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      paymentInfo: checkoutData.paymentInfo,
      note: checkoutData.paymentInfo.note || "",
    };

    // Gọi API lưu hóa đơn
    apiSavePayment(paymentData)
      .then(async (res) => {
        if (res.success) {
          // A) Xóa từng sản phẩm khỏi cart server
          const cartItemsToRemove = checkoutData.cart;
          console.log("Cart items to remove:", cartItemsToRemove);
          
          try {
            // Đếm số sản phẩm đã xóa thành công
            let successCount = 0;
            
            for (const item of cartItemsToRemove) {
              const productId = item.product?._id;
              const itemColor = item.color || "";
              
              if (!productId) {
                console.error("Missing product ID for item:", item);
                continue;
              }
              
              console.log(`Removing product: ${productId}, color: ${itemColor}`);
              try {
                const removeResponse = await apiRemoveCart(productId, itemColor);
                if (removeResponse.success) {
                  successCount++;
                } else {
                  console.warn(`Failed to remove product ${productId} with color ${itemColor}:`, removeResponse.mes);
                }
              } catch (err) {
                console.error(`Error removing product ${productId} with color ${itemColor}:`, err);
              }
            }
            
            if (successCount > 0) {
              toast.success(
                `Đã xóa ${successCount} sản phẩm khỏi giỏ hàng.`
              );
            }
          } catch (removeErr) {
            console.error("Error removing cart items:", removeErr);
            toast.error("Có lỗi khi xóa sản phẩm khỏi giỏ hàng, nhưng đơn hàng đã được lưu thành công.");
          } finally {
            // B) Refresh lại Redux store bất kể có lỗi hay không
            dispatch(getCurrent());
            
            // C) Xóa flag đã chọn
            localStorage.removeItem("selected_cart_items");
          }
        } else {
          console.error("Failed to save payment:", res);
          toast.error(`Lưu đơn hàng thất bại: ${res.mes || "Vui lòng kiểm tra lại."}`);
        }
      })
      .catch((saveErr) => {
        console.error("Error saving payment:", saveErr);
        
        // Hiển thị thông báo lỗi chi tiết hơn
        const errorMessage = saveErr.response?.mes || "Không thể kết nối tới máy chủ";
        toast.error(`Có lỗi khi lưu hóa đơn: ${errorMessage}`);
      });
  }, [checkoutData, responseCode, dispatch, navigate]);

  if (!checkoutData) return null;

  // Extract values cho render
  const amount = (searchParams.get("vnp_Amount") || 0) / 100;
  const orderId = searchParams.get("vnp_TxnRef");
  const transactionNo = searchParams.get("vnp_TransactionNo");
  const bankCode = searchParams.get("vnp_BankCode");
  // Định dạng lại payDate như trên
  const payDate = (() => {
    const pd = searchParams.get("vnp_PayDate") || "";
    return pd
      ? `${pd.slice(6, 8)}/${pd.slice(4, 6)}/${pd.slice(0, 4)} ${pd.slice(
          8,
          10
        )}:${pd.slice(10, 12)}:${pd.slice(12, 14)}`
      : "";
  })();
  const { user, paymentInfo, cart } = checkoutData;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-main mb-6 text-center">
          THANH TOÁN THÀNH CÔNG!
        </h1>

        {/* Thông tin giao dịch */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-green-600">
            Thông tin giao dịch
          </h2>
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
              <strong>Thời gian:</strong> {payDate}
            </p>
          </div>
        </div>

        {/* Thông tin người nhận */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-green-600">
            Thông tin người nhận
          </h2>
          <div className="space-y-2 text-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <p>
                <strong>Họ tên:</strong> {user.firstname} {user.lastname}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>
            <p>
              <strong>Số điện thoại:</strong> {user.mobile}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {paymentInfo.address},{" "}
              {paymentInfo.ward}, {paymentInfo.district}, {paymentInfo.city}
            </p>
          </div>
        </div>

        {/* Sản phẩm đã mua */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-green-600">
            Sản phẩm đã mua
          </h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center border-b pb-4"
              >
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
                    {formatPrice(item.product.price * item.quantity)} VND
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nút Quay về trang chủ */}
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
