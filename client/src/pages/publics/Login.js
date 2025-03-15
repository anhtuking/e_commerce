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
import { useNavigate } from "react-router-dom";
import path from "utils/path";
import { login } from "store/user/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import icons from "utils/icons";
import { validate } from "utils/helpers";
import { Link } from "react-router-dom";
import { showModal } from "store/app/appSlice";
import logo from "assets/logo.png";

const { FaEye, FaEyeSlash } = icons;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const location = useLocation()
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
    const response = await apiForgotPassword({ email });
    // console.log(response);
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
        const result = await apiLogin(data);
        if (result.success) {
          dispatch(
            login({
              isLoggedIn: true,
              token: result.accessToken,
              userData: result.userData,
            })
          );
          navigate(`/${path.HOME}`);
        } else {
          Swal.fire({
            title: "Oops!",
            text: result?.mes,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    }
  }, [payload, isRegister, navigate, dispatch]);

  const finalRegister = async () => {
    const response = await apiFinalRegister(token);
    if (response.success) {
      Swal.fire({
        title: "Congratulations",
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
    <div className="flex items-start justify-center min-h-screen mt-0 pt-0 relative font-main2">
      {isVerifiedEmail && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-overlay z-50 flex flex-col items-center justify-center">
          <div className="bg-white w-[500px] rounded-md p-8 text-justify">
            <h4>
              We have sent your registration code to your email. Please check
              your email and enter your code.
            </h4>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="p-2 w-[310px] border rounded-md outline-none mt-4"
              placeholder="Enter code"
            />
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 font-semibold text-white rounded-md ml-10"
              onClick={finalRegister}
            >
              Submit
            </button>
          </div>
        </div>
      )}
      {isForgotPassword && (
        <div className="absolute animate-slide-right top-0 left-0 bottom-0 right-0 bg-white flex flex-col items-center py-6 z-50">
          <div className="flex flex-col gap-4 font-main2">
            <label htmlFor="email">Enter your email:</label>
            <div className="relative w-[800px]">
              <input
                type={showPassword ? "text" : "password"}
                id="email"
                className="w-[800px] pb-2 border-b outline-none placeholder:text-sm font-main2 bg-[#c5c5c5] rounded-[10px] pt-2"
                placeholder=" Exp: email@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-end w-full gap-4 font-main2">
              <Button
                name="Submit"
                handleOnClick={handleForgotPassword}
                style="px-4 py-2 rounded-md text-white bg-blue-500 my-2"
              />
              <Button
                className="animate-slide-left"
                name="Back"
                handleOnClick={() => setIsForgotPassword(false)}
                style="px-4 py-2 rounded-md text-white bg-main my-2"
              />
            </div>
          </div>
        </div>
      )}
      {/* <img src="" alt="" className="w-full h-full object-contain" /> */}
      <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center font-main2">
        <div className="flex items-center justify-center mb-0">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="mb-2 text-main">Welcome to Marseille!</div>
        <div className="p-8 bg-white flex flex-col items-center rounded-md min-w-[500px]">
          <h1 className="text-[28px] font-semibold text-main mb-8">
            {isRegister ? "Register" : "Login"}
          </h1>
          {isRegister && (
            <div className="flex items-center gap-2">
              <InputField
                value={payload.firstname}
                setValue={setPayload}
                nameKey="firstname"
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
              />
              <InputField
                value={payload.lastname}
                setValue={setPayload}
                nameKey="lastname"
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
              />
            </div>
          )}
          <InputField
            value={payload.email}
            setValue={setPayload}
            nameKey="email"
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          <div className="relative w-full">
            <InputField
              value={payload.password}
              setValue={setPayload}
              nameKey="password"
              type={showPassword ? "text" : "password"}
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
          {isRegister && (
            <InputField
              value={payload.mobile}
              setValue={setPayload}
              nameKey="mobile"
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
          )}
          <Button handleOnClick={handleSubmit} fw>
            {isRegister ? "Sign Up" : "Sign In"}
          </Button>
          <div className="flex items-center justify-between my-2 w-full text-sm cursor-pointer">
            {!isRegister && (
              <span
                className="text-blue-500 hover:underline"
                onClick={() => setIsRegister(true)}
              >
                Register Account
              </span>
            )}
            {!isRegister && (
              <span
                onClick={() => setIsForgotPassword(true)}
                className="text-blue-500 hover:underline"
              >
                Forgot password?
              </span>
            )}
            {isRegister && (
              <span
                className="text-blue-500 hover:underline w-full text-center"
                onClick={() => setIsRegister(false)}
              >
                Login now!
              </span>
            )}
          </div>
          <Link
            className="text-blue-500 text-semibold font-main2 hover:uppercase hover:underline cursor-pointer"
            to={`/${path.HOME}`}
          >
            our shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
