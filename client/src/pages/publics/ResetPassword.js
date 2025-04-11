import React, { useState } from "react";
import { Button } from "../../components";
import { useParams, useNavigate } from "react-router-dom";
import { apiResetPassword } from "../../api/user";
import { toast } from "react-toastify";
import icons from "../../utils/icons";
import path from "../../utils/path";

const { FaEye, FaEyeSlash } = icons;

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!password || !token) {
      toast.error("Vui lòng nhập mật khẩu mới");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    
    const response = await apiResetPassword({ password, token });
    if (response.success) {
      toast.success(response.mes);
      setTimeout(() => {
        navigate(`/${path.LOGIN}`);
      }, 2000);
    } else {
      toast.info(response.mes);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 font-main2">
      <div className="bg-white rounded-xl shadow-2xl w-[500px] p-8 mx-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Đặt lại mật khẩu</h2>
          <p className="text-gray-600 mt-2">Tạo mật khẩu mới để bảo vệ tài khoản của bạn</p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-blue-800 text-sm">
            Vui lòng tạo mật khẩu mạnh trên 6 kí tự.
          </p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu mới
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full p-3 border border-gray-300 rounded-lg outline-none placeholder:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="Nhập mật khẩu mới"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={18}/> : <FaEye size={18}/>}
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className="w-full p-3 border border-gray-300 rounded-lg outline-none placeholder:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="Xác nhận mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash size={18}/> : <FaEye size={18}/>}
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <button
            name="Xác nhận"
            handleOnClick={handleResetPassword}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-indigo-700 hover:from-red-700 hover:to-indigo-800 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
          >  Xác nhận </button>
        </div>
        
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="mx-4 text-sm text-gray-500">HOẶC</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
        
        <div className="text-center">
          <button
            onClick={() => navigate(`/${path.LOGIN}`)}
            className="text-red-600 hover:text-red-800 hover:underline transition-colors font-medium"
          >
            Quay lại trang đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;