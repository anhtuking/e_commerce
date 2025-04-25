import React, { useState } from "react";
import { Button, Loading } from "components";
import { apiForgotPassword } from "api/user";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { showModal } from "store/app/appSlice";

const ForgotPasswordForm = ({ goBack }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast.error("Vui lòng nhập địa chỉ email");
      return;
    }

    dispatch(showModal({isShowModal: true, modalChildren: <Loading />}))
    const response = await apiForgotPassword({ email });
    dispatch(showModal({isShowModal: false, modalChildren: null}))
    
    if (response.success) {
      toast.success(response.mes);
    } else {
      toast.info(response.mes);
    }
  };

  return (
    <div className="flex flex-col gap-4 font-main2 w-full bg-white p-8 rounded-xl shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Quên mật khẩu</h2>
        <button 
          onClick={goBack}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <p className="text-blue-800 text-sm">
          Nhập địa chỉ email đã đăng ký của bạn. Chúng tôi sẽ gửi một liên kết đặt lại mật khẩu đến email của bạn.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Địa chỉ email
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none placeholder:text-sm font-main2 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
              placeholder="Nhập địa chỉ email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-4 mt-6">
        <Button
          name="Gửi yêu cầu"
          handleOnClick={handleForgotPassword}
          style="px-6 py-3 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-all shadow-md flex items-center gap-2"
        >
          Gửi yêu cầu
        </Button>
        <Button
          name="Quay lại"
          handleOnClick={goBack}
          style="px-6 py-3 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all shadow-md flex items-center gap-2"
        >
          Quay lại
        </Button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm; 