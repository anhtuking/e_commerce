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
import logo2 from "assets/logo2.png";

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
        dispatch(showModal({isShowModal: true, modalChildren: <Loading />}))
        try {
          // Log the data being sent to the server
          console.log('Sending login data:', data);
          
          const result = await apiLogin(data);
          dispatch(showModal({isShowModal: false, modalChildren: null}))
          
          console.log('Full login response:', JSON.stringify(result));
          
          if (result && result.success) {
            // Check if all required properties exist in the response
            if (!result.accessToken) {
              console.error('Missing accessToken in successful response');
            }
            
            if (!result.userData) {
              console.error('Missing userData in successful response');
            }
            
            const userData = result.userData || {};
            console.log('User data:', userData);
            
            dispatch(
              login({
                isLoggedIn: true,
                token: result.accessToken,
                userData: userData,
              })
            );
            navigate(`/${path.HOME}`);
          } else {
            console.log('Login failed reason:', result?.mes || 'No error message');
            
            Swal.fire({
              title: "Login Failed",
              text: result?.mes || "Invalid email or password. Please try again.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        } catch (error) {
          console.error('Login error details:', error);
          dispatch(showModal({isShowModal: false, modalChildren: null}));
          Swal.fire({
            title: "Connection Error",
            text: "Could not connect to the server. Please check your connection and try again.",
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 font-main2">
      {isVerifiedEmail && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-overlay z-50 flex flex-col items-center justify-center">
          <div className="bg-white w-[500px] rounded-lg shadow-xl p-8 text-justify">
            <h4 className="text-gray-800 font-medium mb-4">
              We have sent your registration code to your email. Please check
              your email and enter your code.
            </h4>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="p-3 w-full border border-gray-300 rounded-md outline-none mt-4 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                placeholder="Enter code"
              />
              <button
                type="button"
                className="px-6 py-3 bg-red-900 hover:bg-red-700 font-semibold text-white rounded-md mt-4 transition-all shadow-md"
                onClick={finalRegister}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {isForgotPassword && (
        <div className="absolute animate-slide-right top-0 left-0 bottom-0 right-0 bg-white flex flex-col items-center justify-center py-6 z-50">
          <div className="flex flex-col gap-4 font-main2 w-[600px] bg-white p-8 rounded-xl shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Password Recovery</h2>
            <p className="text-gray-600 mb-4">Enter your email address and we'll send you a link to reset your password.</p>
            <label htmlFor="email" className="text-gray-700 font-medium">Your Email Address:</label>
            <div className="relative w-full">
              <input
                type="email"
                id="email"
                className="w-full p-3 border border-gray-300 rounded-lg outline-none placeholder:text-sm font-main2 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-end w-full gap-4 font-main2 mt-4">
              <Button
                name="Submit"
                handleOnClick={handleForgotPassword}
                style="px-6 py-3 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-all shadow-md"
              />
              <Button
                className="animate-slide-left"
                name="Back"
                handleOnClick={() => setIsForgotPassword(false)}
                style="px-6 py-3 rounded-lg text-white bg-gray-600 hover:bg-gray-700 transition-all shadow-md"
              />
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
            <p className="text-sm opacity-80 mt-6 max-w-xs">Discover a world of premium products with exceptional shopping experience</p>
            <p className="text-sm opacity-80 mt-6 max-w-xs">Wish customers have the best service experience in Marseille.</p>
          </div>
        </div>
        <div className="w-full md:w-3/5 p-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-gray-600 text-center mb-8">
            {isRegister 
              ? "Fill in your details to create your account" 
              : "Sign in to access your account and dashboard"}
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
                placeholder="First Name"
              />
              <InputField
                value={payload.lastname}
                setValue={setPayload}
                nameKey="lastname"
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
                styleClass="border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                placeholder="Last Name"
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
            placeholder="Email Address"
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
              placeholder="Password"
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
              placeholder="Mobile Number"
            />
          )}
          
          <button 
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-red-600 to-indigo-700 hover:from-red-700 hover:to-indigo-800 text-white font-semibold py-3 px-4 rounded-lg mt-6 transition-all duration-300 shadow-md transform hover:-translate-y-1"
          >
            {isRegister ? "Create Account" : "Sign In"}
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
                Create an Account
              </button>
            )}
            {!isRegister && (
              <button
                onClick={() => setIsForgotPassword(true)}
                className="text-red-600 hover:text-red-800 hover:underline transition-colors"
              >
                Forgot Password?
              </button>
            )}
            {isRegister && (
              <button
                className="text-red-600 hover:text-red-800 hover:underline w-full text-center transition-colors"
                onClick={() => setIsRegister(false)}
              >
                Already have an account? Sign In
              </button>
            )}
          </div>
          
          <div className="text-center mt-8">
            <Link
              className="text-red-600 font-medium hover:text-red-800 hover:underline transition-colors inline-block"
              to={`/${path.HOME}`}
            >
              Our Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
