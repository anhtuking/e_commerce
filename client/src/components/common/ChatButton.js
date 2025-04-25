import React from 'react';
import { Link } from 'react-router-dom';
import path from 'utils/path';
import icons from 'utils/icons';

const { RiRobot3Line } = icons;

const ChatButton = () => {
  return (
    <div className="fixed bottom-10 right-10 z-50 group cursor-pointer">
      {/* Hiệu ứng nhấp nháy */}
      <div className="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-ping pointer-events-none"></div>
      
      {/* Nút chat */}
      <Link
        to={`/${path.CHATBOT_DETAILS}`}
        className="w-16 h-16 rounded-full flex items-center justify-center bg-red-700 text-white hover:bg-red-600 transition-all duration-300 shadow-lg transform hover:scale-110 active:scale-95 relative z-10"
        aria-label="Chatbot"
      >
        <RiRobot3Line size={26} className="animate-pulse" />
      </Link>
      
      {/* Tooltip hiển thị khi hover */}
       <div className="absolute bottom-full right-0 mb-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-white p-2 rounded-lg shadow-md text-sm font-medium text-gray-800 whitespace-nowrap mr-1">
          <p>Hỗ trợ ngay</p>
          <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-white transform rotate-45"></div>
        </div>
      </div>
    </div>
  );
};

export default ChatButton; 