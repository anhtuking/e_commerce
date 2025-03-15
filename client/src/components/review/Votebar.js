import React, { memo, useRef, useEffect } from "react";
import { AiFillStar } from "react-icons/ai";

const Votebar = ({ number, ratingCounts, ratingTotal }) => {
  const percentRef = useRef();
  useEffect(() => {
    const percent = Math.round(ratingCounts * 100 / ratingTotal) || 0
    percentRef.current.style.cssText = `right: ${100 - percent}%`;
  }, [ratingCounts, ratingTotal]);
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 font-main2">
      <div className="flex w-[10%] gap-1 text-sm items-center justify-center">
        <span>{number}</span>
        <AiFillStar color="orange" />
      </div>
      <div className="w-[75%]">
        <div className="relative w-full h-[6px] bg-gray-300 rounded-l-full rounded-r-full">
          <div
            ref={percentRef}
            className="absolute inset-0 bg-red-500 right-8"
          ></div>
        </div>
      </div>
      <div className="w-[15%] text-xs text-gray-400 flex justify-end">
        {`${ratingCounts || 0} reviewer`}
      </div>
    </div>
  );
};

export default memo(Votebar);
