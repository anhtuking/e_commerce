import React from "react";

const Button = ({
  children,
  handleOnClick,
  style,
  fw,
  type = "button",
  fullWidth,
  className,
  ...props
}) => {
  return (
    <button
      type={type}
      className={`py-2 px-4 rounded-md text-white bg-main hover:bg-red-600 transition-colors duration-300 font-semibold ${
        fw ? "w-full" : ""
      } ${fullWidth ? "w-full" : ""} ${className || ""}`}
      onClick={handleOnClick}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 