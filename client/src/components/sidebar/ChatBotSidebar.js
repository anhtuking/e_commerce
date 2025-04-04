import PropType from "prop-types";
import logo2 from '../../assets/logo2.png';
import { useDispatch, useSelector } from "react-redux";
import { addChat, removeChat } from "store/chat/chatSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsPlusLg, BsTrash, BsX } from "react-icons/bs";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { TiArrowBack } from "react-icons/ti";
import withBase from "hocs/withBase";
const ChatBotSidebar = ({ onToggle }) => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.chat);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleNewChat = () => {
    dispatch(addChat());
  };

  const handleRemoveChat = (id) => {
    dispatch(removeChat(id));
    navigate('/chatbot/info')
  };

  return (
    <div className="bg-gray-800 w-full h-full flex flex-col text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <img
          src={logo2}
          alt="Admin Logo"
          className="flex w-[240px] h-[70px] pl-10 mt-2"
        />
        <button
          onClick={onToggle}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors lg:hidden"
        >
          <BsX className="text-xl" />
        </button>
      </div>

      {/* New chat button */}
      <div className="p-4">
        <button
          className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 hover:bg-teal-800 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
          onClick={handleNewChat}
        >
          <BsPlusLg className="text-sm" />
          <span>Cuộc trò chuyện mới</span>
        </button>
      </div>

      {/* Recent chats */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="mb-2 px-3 py-2 text-sm font-medium text-gray-400">
          Gần đây
        </div>
        <div className="space-y-1">
          {data?.map((chat) => (
            <Link
              to={`/chatbot/${chat.id}`}
              key={chat?.id}
              className={`flex items-center justify-between p-3 rounded-lg group ${
                chat.id === id 
                  ? 'bg-gray-500 hover:bg-gray-400' 
                  : 'bg-gray-700 hover:bg-gray-600'
              } transition-colors`}
            >
              <div className="flex items-center gap-3 truncate">
                <BiMessageRoundedDetail className={`${chat.id === id ? 'text-white' : 'text-gray-400'} flex-shrink-0`} />
                <span className="truncate">{chat.title}</span>
              </div>
              <button
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-gray-600 transition-all duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  handleRemoveChat(chat.id);
                }}
              >
                <BsTrash className="color-white" />
              </button>
            </Link>
          ))}

          {data?.length === 0 && (
            <div className="text-center text-gray-500 py-6">
              <p>Bạn chưa có cuộc trò chuyện nào</p>
              <p className="text-sm mt-2">Bấm "Cuộc trò chuyện mới" để bắt đầu</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-gray-700 p-3 flex items-center justify-center">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors p-3 rounded-lg hover:bg-gray-700"
        >
          <TiArrowBack className="text-lg size-7" />
          <span>Our Shop</span>
        </Link>
      </div>
    </div>
  );
};

ChatBotSidebar.propTypes = {
  onToggle: PropType.func,
};

export default withBase(ChatBotSidebar);  