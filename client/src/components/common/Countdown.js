import React, { memo, useEffect, useState } from "react";

const Countdown = ({ unit, number }) => {
  const [prevNumber, setPrevNumber] = useState(number);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    // Detect changes in number to trigger animations
    if (prevNumber !== number) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setPrevNumber(number);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [number, prevNumber]);

  return (
    <div className="w-[60px] h-[60px] flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-[#f4f4f4] rounded-md shadow-sm hover:shadow-md transition-all duration-300 cursor-default border border-gray-100 relative overflow-hidden group">
      {/* Pulsing background when seconds change */}
      {isAnimating && (
        <div className="absolute inset-0 bg-red-100 animate-pulse opacity-40 z-0"></div>
      )}
      
      {/* Number display with sliding animation */}
      <div className="relative z-10 h-[22px] w-full overflow-hidden">
        {isAnimating ? (
          <div className="relative w-full h-full">
            {/* Previous number sliding up */}
            <div className="absolute w-full text-center animate-slide-out-up">
              <span className="text-[18px] font-semibold text-gray-800">
                {prevNumber < 10 ? `0${prevNumber}` : prevNumber}
              </span>
            </div>
            
            {/* New number sliding down */}
            <div className="absolute w-full text-center animate-slide-in-down">
              <span className="text-[18px] font-semibold text-red-600">
                {number < 10 ? `0${number}` : number}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full text-center">
            <span className={`text-[18px] font-semibold transition-colors duration-300 ${unit === "Seconds" ? "group-hover:text-red-600" : "text-gray-800"}`}>
              {number < 10 ? `0${number}` : number}
            </span>
          </div>
        )}
      </div>
      
      {/* Unit label with subtle hover effect */}
      <span className="text-[10px] text-gray-700 mt-1 group-hover:text-gray-900 transition-colors duration-300">{unit}</span>
      
      {/* Animated border bottom */}
      <div className={`absolute bottom-0 left-0 h-1 bg-red-500 transition-all duration-300 ${unit === "Seconds" ? "w-full opacity-50 group-hover:opacity-100" : "w-0 group-hover:w-full opacity-0 group-hover:opacity-50"}`}></div>
    </div>
  );
};

export default memo(Countdown);
