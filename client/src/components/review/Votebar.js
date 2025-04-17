import React, { memo, useRef, useEffect } from "react";
import { AiFillStar } from "react-icons/ai";

const Votebar = ({ number, ratingCounts, ratingTotal }) => {
  const percentRef = useRef();
  useEffect(() => {
    const percent = Math.round(ratingCounts * 100 / ratingTotal) || 0
    percentRef.current.style.cssText = `right: ${100 - percent}%`;
  }, [ratingCounts, ratingTotal]);
  
  return (
    <div className="flex items-center gap-3 text-sm text-gray-600 font-main2 mb-1">
      <div className="flex w-[10%] gap-1 text-sm items-center justify-center">
        <span className="font-medium">{number}</span>
        <AiFillStar className="text-yellow-500" />
      </div>
      <div className="w-[75%]">
        <div className="relative w-full h-[8px] bg-gray-200 rounded-full overflow-hidden">
          <div
            ref={percentRef}
            className="absolute inset-0 bg-red-500 right-8 transition-all duration-300"
          ></div>
        </div>
      </div>
      <div className="w-[15%] text-xs flex justify-end">
        <span className="bg-gray-100 px-2 py-1 rounded-full text-gray-600">
          {`${ratingCounts || 0} đánh giá`}
        </span>
      </div>
    </div>
  );
};

export default memo(Votebar);
