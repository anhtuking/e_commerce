/* eslint-disable react/style-prop-object */
import React, { useState, useCallback, useEffect } from "react";
import { InputField, Button, Loading } from "components";
import {
  apiRegister,
  apiLogin,
  apiForgotPassword,
  apiFinalRegister,
} from "api/user";
import Swal from "sweetalert2";
import { useNavigate, useSearchParams } from "react-router-dom";
import path from "utils/path";
import { login } from "store/user/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import icons from "utils/icons";
import { validate } from "utils/helpers";
import { Link } from "react-router-dom";
import { showModal } from "store/app/appSlice";
import logo2 from "assets/logo2.png";
import { MdEmail, MdArrowBack } from "react-icons/md";

const { FaEye, FaEyeSlash } = icons;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [payload, setPayload] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    mobile: "",
  });
  const [isVerifiedEmail, setIsVerifiedEmail] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const resetPayload = () => {
    setPayload({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      mobile: "",
    });
  };
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const handleForgotPassword = async () => {
    dispatch(showModal({isShowModal: true, modalChildren: <Loading />}))
    const response = await apiForgotPassword({ email });
    dispatch(showModal({isShowModal: false, modalChildren: null}))
    if (response.success) {
      toast.success(response.mes);
    } else {
      toast.info(response.mes);
    }
  };
  useEffect(() => {
    resetPayload();
  }, [isRegister]);
  const handleSubmit = useCallback(async () => {
    const { firstname, lastname, mobile, ...data } = payload;

    const invalids = isRegister
      ? validate(payload, setInvalidFields)
      : validate(data, setInvalidFields);
    if (invalids === 0) {
      if (isRegister) {
        dispatch(showModal({isShowModal: true, modalChildren: <Loading />}))
        const response = await apiRegister(payload);
        dispatch(showModal({isShowModal: false, modalChildren: null}))
        if (response.success) {
          setIsVerifiedEmail(true);
        } else {
          Swal.fire({
            title: "Oops!",
            text: response?.mes,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } else {
        try {
          dispatch(showModal({isShowModal: true, modalChildren: <Loading />}))
          const result = await apiLogin(data);
          dispatch(showModal({isShowModal: false, modalChildren: null}))
          
          if (result && result.success) {
            // Check if all required properties exist in the response
            if (!result.accessToken) {
              console.error('Missing accessToken in successful response');
            }
            
            if (!result.userData) {
              console.error('Missing userData in successful response');
            }
            
            const userData = result.userData || {};
            
            dispatch(
              login({
                isLoggedIn: true,
                token: result.accessToken,
                userData: userData,
              })
            );
            searchParams.get('redirect') ? navigate(searchParams.get('redirect')) : navigate(`/${path.HOME}`);
          } else {   
            Swal.fire({
              title: "Đăng nhập thất bại",
              text: result?.mes || "Tài khoản hoặc mật khẩu không chính xác. Vui lòng thử lại.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        } catch (error) {
          console.error('Login error details:', error);
          dispatch(showModal({isShowModal: false, modalChildren: null}));
          Swal.fire({
            title: "Lỗi kết nối",
            text: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet và thử lại.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    }
  }, [payload, isRegister]);

  const finalRegister = async () => {
    const response = await apiFinalRegister(token);
    if (response.success) {
      Swal.fire({
        title: "Chúc mừng",
        text: response?.mes,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        setIsRegister(false);
        resetPayload();
      });
    } else {
      Swal.fire({
        title: "Oops!",
        text: response?.mes,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
    setIsVerifiedEmail(false);
    setToken("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 font-main2">
      {isVerifiedEmail && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-overlay z-50 flex flex-col items-center justify-center">
          <div className="bg-white w-[500px] rounded-lg shadow-xl p-8 text-justify">
            <h4 className="text-gray-800 font-medium mb-4">
              Chúng tôi đã gửi mã đăng ký của bạn đến email của bạn. Vui lòng kiểm tra email của bạn và nhập mã của bạn.
            </h4>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="p-3 w-full border border-gray-300 rounded-md outline-none mt-4 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                placeholder="Nhập mã"
              />
              <button
                type="button"
                className="px-6 py-3 bg-red-900 hover:bg-red-700 font-semibold text-white rounded-md mt-4 transition-all shadow-md"
                onClick={finalRegister}
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
      {isForgotPassword && (
        <div className="absolute animate-slide-right top-0 left-0 bottom-0 right-0 bg-white flex flex-col items-center justify-center py-6 z-50">
          <div className="flex flex-col gap-4 font-main2 w-[600px] bg-white p-8 rounded-xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Quên mật khẩu</h2>
              <button 
                onClick={() => setIsForgotPassword(false)}
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
              > Gửi yêu cầu </Button>
              <Button
                name="Quay lại"
                handleOnClick={() => setIsForgotPassword(false)}
                style="px-6 py-3 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all shadow-md flex items-center gap-2"
              > Quay lại </Button>
            </div>
          </div>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {isRegister ? "Tạo tài khoản" : "Chào mừng đến với cửa hàng của chúng tôi"}
          </h1>
          <p className="text-gray-600 text-center mb-8">
            {isRegister 
              ? "Điền thông tin của bạn để tạo tài khoản" 
              : "Đăng nhập để truy cập tài khoản và bảng điều khiển"}
          </p>
          
          {isRegister && (
            <div className="flex items-center gap-4 mb-2">
              <InputField
                value={payload.firstname}
                setValue={setPayload}
                nameKey="firstname"
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
                styleClass="border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                placeholder="Tên"
              />
              <InputField
                value={payload.lastname}
                setValue={setPayload}
                nameKey="lastname"
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
                styleClass="border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                placeholder="Họ"
              />
            </div>
          )}
          <InputField
            value={payload.email}
            setValue={setPayload}
            nameKey="email"
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
            styleClass="border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
            placeholder="Email"
          />
          <div className="relative w-full">
            <InputField
              value={payload.password}
              setValue={setPayload}
              nameKey="password"
              type={showPassword ? "text" : "password"}
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
              styleClass="border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
              placeholder="Mật khẩu"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          {isRegister && (
            <InputField
              value={payload.mobile}
              setValue={setPayload}
              nameKey="mobile"
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
              styleClass="border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
              placeholder="Số điện thoại"
            />
          )}
          
          <button 
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-red-600 to-indigo-700 hover:from-red-700 hover:to-indigo-800 text-white font-semibold py-3 px-4 rounded-lg mt-6 transition-all duration-300 shadow-md transform hover:-translate-y-1"
          >
            {isRegister ? "Tạo tài khoản" : "Đăng nhập"}
          </button>
          
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500">OR</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>
          
          <div className="flex items-center justify-between mt-4 w-full text-sm">
            {!isRegister && (
              <button
                className="text-red-600 hover:text-red-800 hover:underline transition-colors"
                onClick={() => setIsRegister(true)}
              >
                Tạo tài khoản
              </button>
            )}
            {!isRegister && (
              <button
                onClick={() => setIsForgotPassword(true)}
                className="text-red-600 hover:text-red-800 hover:underline transition-colors"
              >
                Quên mật khẩu?
              </button>
            )}
            {isRegister && (
              <button
                className="text-red-600 hover:text-red-800 hover:underline w-full text-center transition-colors"
                onClick={() => setIsRegister(false)}
              >
                Đã có tài khoản?
              </button>
            )}
          </div>
          
          <div className="text-center mt-8">
            <Link
              className="text-red-600 font-medium hover:text-red-800 hover:underline transition-colors inline-block"
              to={`/${path.HOME}`}
            >
              Cửa hàng của chúng tôi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;