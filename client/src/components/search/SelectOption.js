import React, { memo } from "react";

const SelectOption = ({ icon }) => {
  return (
    <div 
      className="w-10 h-10 bg-white backdrop-blur-md bg-opacity-90 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 hover:text-white cursor-pointer border border-gray-100 transition-all duration-200 hover:scale-110 active:scale-95"
    >
      {icon}
    </div>
  );
};

export default memo(SelectOption);
