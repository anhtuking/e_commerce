import React, { useState } from "react";
import { Button } from "../../components";
import { useParams } from "react-router-dom";
import { apiResetPassword } from "../../api/user";
import { toast } from "react-toastify";
import icons from "../../utils/icons";

const { FaEye, FaEyeSlash } = icons;

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { token } = useParams();

  const handleResetPassword = async () => {
    if (!password || !token) {
      toast.error("Missing password or token");
      return;
    }
    const response = await apiResetPassword({ password, token });
    if (response.success) {
      toast.success(response.mes);
    } else {
      toast.info(response.mes);
    }
  };

  return (
    <div className="absolute animate-slide-right top-0 left-0 bottom-0 right-0 bg-white flex flex-col items-center py-8 z-50 font-main2">
      <div className="flex flex-col gap-4">
        <label htmlFor="password">Enter your new password:</label>
        <div className="relative w-[800px]">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className="w-full pb-2 border-b outline-none placeholder:text-sm pr-10"
            placeholder="Type here"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash size={25}/> : <FaEye size={25}/>}
          </button>
        </div>
        <div className="flex items-center justify-end w-full gap-4">
          <Button
            name="Submit"
            handleOnClick={handleResetPassword}
            className="px-4 py-2 rounded-md text-white bg-blue-500 my-2"
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
