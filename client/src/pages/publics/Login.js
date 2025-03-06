import React, { useState, useCallback } from "react";
import { InputField, Button } from "../../components";

const Login = () => {
  const [payload, setPayload] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ''
  });
  const [isRegister, setIsRegister] = useState(false);
  const handleSubmit = useCallback(() => {
    console.log(payload);
  }, [payload]);
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
            <InputField
              value={payload.name}
              setValue={setPayload}
              nameKey="name"
            />
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
              value={payload.confirmPassword}
              setValue={setPayload}
              nameKey="confirmPassword"
            />
          )}
          <Button
            name={isRegister ? "Register" : "Login"}
            handleOnClick={handleSubmit}
            fw
          />
          <div className="flex items-center justify-between my-2 w-full text-sm cursor-pointer">
            {!isRegister && <span className="text-blue-500 hover:underline">Forgot password?</span>}
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
