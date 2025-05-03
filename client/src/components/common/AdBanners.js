import React, { useState, useEffect } from 'react';

const AdBanners = () => {
  // Add blinking effect for the "Sale" tag
  const [blink, setBlink] = useState(true);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(prev => !prev);
    }, 700);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-10 left-10 z-10 flex justify-start w-[100px]">
      <div className="flex flex-col items-center space-y-2 mb-4 gap-2">
        <div className="transform hover:scale-105 transition-all duration-300 hover:rotate-1 relative group animate-bounce-subtle">
          {/* Enhanced glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-40 rounded blur-md transition-opacity duration-300"></div>
          
          {/* Pulsating border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 rounded-lg opacity-70 animate-pulse-border blur-sm"></div>
          
          {/* Sale tag */}
          <div className={`absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full z-20 transform rotate-12 ${blink ? 'opacity-100' : 'opacity-70'}`}>
            SALE!
          </div>
          
          <img 
            src="https://image.useinsider.com/fptshop/defaultImageLibrary/item%20%286%29-1720447573.png" 
            alt="Banner 1" 
            className="h-16 rounded shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-slow relative z-10"
          />
        </div>

        <div className="transform hover:scale-105 transition-all duration-300 hover:-rotate-1 relative group animate-float">
          {/* Enhanced glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-yellow-500 opacity-0 group-hover:opacity-40 rounded blur-md transition-opacity duration-300"></div>
          
          {/* Pulsating border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 rounded-lg opacity-70 animate-pulse-border-slow blur-sm"></div>
          
          {/* New tag */}
          <div className={`absolute -top-3 -left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full z-20 transform -rotate-12 ${!blink ? 'opacity-100' : 'opacity-70'}`}>
            NEW!
          </div>
          
          <img 
            src="https://image.useinsider.com/fptshop/defaultImageLibrary/item%20%285%29-1720447610.png" 
            alt="Banner 2" 
            className="h-16 rounded shadow-lg hover:shadow-xl transition-all duration-300 relative z-10"
          />
        </div>
      </div>
    </div>
  );
};

export default AdBanners; 