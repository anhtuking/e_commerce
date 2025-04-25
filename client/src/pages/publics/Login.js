import React, { useState } from "react";
import logo2 from "assets/logo2.png";
import { LoginForm, RegisterForm, ForgotPasswordForm } from "components/auth";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const switchToLogin = () => {
    setIsRegister(false);
    setIsForgotPassword(false);
  };

  const switchToRegister = () => {
    setIsRegister(true);
    setIsForgotPassword(false);
  };

  const switchToForgotPassword = () => {
    setIsForgotPassword(true);
    setIsRegister(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 font-main2">
      {isForgotPassword && (
        <div className="absolute animate-slide-right top-0 left-0 bottom-0 right-0 bg-white flex flex-col items-center justify-center py-6 z-50">
          <ForgotPasswordForm goBack={switchToLogin} />
        </div>
      )}
      <div className="p-0 flex flex-col md:flex-row items-stretch bg-white rounded-2xl shadow-2xl overflow-hidden w-[900px]">
        <div className="w-0 md:w-2/5 bg-gradient-to-br from-red-600 to-indigo-800 flex flex-col items-center justify-center p-8 relative">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-pattern-dots"></div>
          </div>
          <div className="relative z-10 text-white text-center">
            <img
              src={logo2}
              alt="Admin Logo"
              className="w-[300px] h-[100px] "
            />
            <p className="text-sm opacity-80 mt-6 max-w-xs">Khám phá một thế giới sản phẩm tốt nhất với trải nghiệm mua sắm tuyệt vời</p>
            <p className="text-sm opacity-80 mt-6 max-w-xs">Chúng tôi mong muốn khách hàng có trải nghiệm mua sắm tốt nhất tại Marseille.</p>
          </div>
        </div>
        <div className="w-full md:w-3/5 p-10">
          {isRegister ? (
            <RegisterForm switchToLogin={switchToLogin} />
          ) : (
            <LoginForm 
              switchToRegister={switchToRegister}
              switchToForgotPassword={switchToForgotPassword}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;