import React from 'react';
import icons from 'utils/icons';
import { useSelector } from 'react-redux';
import { setModalOpen, addChat, setActiveChatId } from 'store/chat/chatSlice';
import withBase from 'hocs/withBase';

const { RiRobot3Line } = icons;

const ChatButton = ({ dispatch }) => {
  const { data } = useSelector((state) => state.chat);
  const { isLoggedIn } = useSelector((state) => state.user);

  const handleOpenChat = () => {
    if (data?.length === 0) {
      dispatch(addChat());
    } else {
      dispatch(setActiveChatId(data[0].id));
      dispatch(setModalOpen(true));
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="fixed bottom-32 right-10 z-1000 group cursor-pointer">
      {/* Hiệu ứng nhấp nháy */}
      <div className="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-ping pointer-events-none"></div>
      {/* Nút chat */}
      <button
        onClick={handleOpenChat}
        className="w-16 h-16 rounded-full flex items-center justify-center bg-red-700 text-white hover:bg-red-600 transition-all duration-300 shadow-lg transform hover:scale-110 active:scale-95 relative z-10"
        aria-label="Chatbot"
      >
        <RiRobot3Line size={26} className="animate-pulse"/>
      </button>
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

export default withBase(ChatButton); 