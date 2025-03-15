import React, { memo } from "react";

const Countdown = ({ unit, number }) => {
  return (
    <div className="w-[80px] h-[80px] flex flex-col items-center justify-center bg-[#f4f4f4] rounded-md">
      <span className="text-[18px] text-gray-800">{number}</span>
      <span className="text-xs text-gray-700">{unit}</span>
    </div>
  );
};

export default memo(Countdown);
