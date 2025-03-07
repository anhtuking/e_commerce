import React, { useState, useCallback } from "react";
import { InputField, Button } from "../../components";
import { apiRegister, apiLogin } from "../../api/user";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import path from "../../utils/path";
import { register } from "../../store/user/userSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [payload, setPayload] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phone: "",
  });
  const [isRegister, setIsRegister] = useState(false);
  const resetPayload = () => {
    setPayload({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      mobile: "",
    });
  };
  const handleSubmit = useCallback(async () => {
    const { firstname, lastname, mobile, ...data } = payload;
    if (isRegister) {
      const response = await apiRegister(payload);
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
    } else {
      const result = await apiLogin(data);
      if (result.success) {
        dispatch(register({
          isLoggedIn: true,
          token: result.accessToken,
          userData: result.userData
        }))
        navigate(`/${path.HOME}`)
      } else {
        Swal.fire({
          title: "Oops!",
          text: result?.mes,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  }, [payload, isRegister, navigate, dispatch]);
  return (
    <div className="w-screen h-screen relative">
      <img
        src="https://vietnguyenco.vn/wp-content/uploads/2018/08/bg-login2.jpg"
        alt=""
        className="w-full h-full object-cover"
      />
      <div className="absolute top-0 bottom-0 left-0 right-1/2 flex items-center justify-center">
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
              />
              <InputField
                value={payload.lastname}
                setValue={setPayload}
                nameKey="lastname"
              />
            </div>
          )}
          <InputField
            value={payload.email}
            setValue={setPayload}
            nameKey="email"
          />
          <InputField
            value={payload.password}
            setValue={setPayload}
            nameKey="password"
            type="password"
          />
          {isRegister && (
            <InputField
              value={payload.mobile}
              setValue={setPayload}
              nameKey="mobile"
            />
          )}
          <Button
            name={isRegister ? "Register" : "Login"}
            handleOnClick={handleSubmit}
            fw
          />
          <div className="flex items-center justify-between my-2 w-full text-sm cursor-pointer">
            {!isRegister && (
              <span className="text-blue-500 hover:underline">
                Forgot password?
              </span>
            )}
            {!isRegister && (
              <span
                className="text-blue-500 hover:underline"
                onClick={() => setIsRegister(true)}
              >
                Register Account.
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
        </div>
      </div>
    </div>
  );
};

export default Login;
