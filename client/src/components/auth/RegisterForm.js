import React, { useState, useCallback } from "react";
import { InputField, Loading } from "components";
import { apiRegister, apiFinalRegister } from "api/user";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { validate } from "utils/helpers";
import { showModal } from "store/app/appSlice";
import icons from "utils/icons";

const { FaEye, FaEyeSlash } = icons;

const RegisterForm = ({ switchToLogin }) => {
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
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState("");

  const handleRegister = useCallback(async () => {
    const invalids = validate(payload, setInvalidFields);
    if (invalids === 0) {
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
    }
  }, [payload, dispatch]);

  const finalRegister = async () => {
    const response = await apiFinalRegister(token);
    if (response.success) {
      Swal.fire({
        title: "Chúc mừng",
        text: response?.mes,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        switchToLogin();
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
    <div className="w-full">
      {isVerifiedEmail ? (
        <div className="bg-white rounded-lg p-8 text-justify">
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
      ) : (
        <>
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Tạo tài khoản
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Điền thông tin của bạn để tạo tài khoản
          </p>
          
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
          <InputField
            value={payload.mobile}
            setValue={setPayload}
            nameKey="mobile"
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
            styleClass="border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
            placeholder="Số điện thoại"
          />
          
          <button 
            onClick={handleRegister}
            className="w-full bg-gradient-to-r from-red-600 to-indigo-700 hover:from-red-700 hover:to-indigo-800 text-white font-semibold py-3 px-4 rounded-lg mt-6 transition-all duration-300 shadow-md transform hover:-translate-y-1"
          >
            Tạo tài khoản
          </button>
          
          <div className="text-center mt-4 w-full text-sm">
            <button
              className="text-red-600 hover:text-red-800 hover:underline transition-colors"
              onClick={switchToLogin}
            >
              Đã có tài khoản?
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RegisterForm; 