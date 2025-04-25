import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import ImgTemp from "assets/temp.jpeg";
import IconMenu from "assets/menu.png";
import ChatBotSidebar from "components/sidebar/ChatBotSidebar";
import Gemini from "gemini";
import { useSelector } from "react-redux";
import { addMessage, setNameChat } from "store/chat/chatSlice";
import { HiOutlinePaperAirplane, HiOutlineRefresh } from "react-icons/hi";
import { BsChatLeftDots, BsRobot, BsPerson } from "react-icons/bs";
import withBase from "hocs/withBase";

const ChatDetail = ({ dispatch, navigate }) => {
  const [menuToggle, setMenuToggle] = useState(true);
  const [dataDetail, setDataDetail] = useState([]);
  const [messageDetail, setMessageDetail] = useState([]);
  const [inputChat, setInputChat] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { id } = useParams();
  const { data } = useSelector((state) => state.chat);

  useEffect(() => {
    if (data?.length > 0) {
      const chat = data.find((chat) => chat.id === id);
      if (chat) {
        setDataDetail(chat);
        setMessageDetail(chat.messages);
      }
    }
  }, [data, id]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messageDetail]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChatDetail = async () => {
    if (!inputChat.trim()) return;
    if (id) {
      setIsLoading(true);
      try {
        const chatText = await Gemini(inputChat, messageDetail);
        if (dataDetail.title === 'Chat') {
          const promptName = `Đây là một cuộc trò chuyện mới và người dùng hỏi về ${inputChat}. Không trả lời và bình luận chỉ cần cho tôi một cái tên cho cuộc trò chuyện này, độ dài tối đa là 20 ký tự`;
          const newTitle = await Gemini(promptName);
          dispatch(setNameChat({ newTitle, chatId: id }));
        }
        if (chatText) {
          const dataMessage = {
            idChat: id,
            userMess: inputChat,
            botMess: chatText,
          };

          dispatch(addMessage(dataMessage));
          setInputChat("");
        }
      } catch (error) {
        console.error("Error in chat:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatDetail();
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex">
      {/* Sidebar */}
      <div className={`fixed h-full top-0 left-0 transition-all duration-300 z-10 ${menuToggle ? 'translate-x-0' : '-translate-x-full'}`} style={{ width: '320px' }}>
        <ChatBotSidebar onToggle={() => setMenuToggle(!menuToggle)} />
      </div>

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${menuToggle ? 'ml-[320px]' : 'ml-0'}`}>
        {/* Header */}
        <div className="bg-white border-b shadow-sm py-4 px-6 flex items-center sticky top-0 z-10">
          <button
            onClick={() => setMenuToggle(!menuToggle)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-3"
          >
            <img src={IconMenu} alt="menu icon" className="w-6 h-6" />
          </button>
          <div 
            className="flex items-center justify-center place-items-center flex-1 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/chatbot/info')}
          >
            <BsRobot className="text-teal-500 text-2xl mr-2" />
            <h1 className="text-xl font-semibold text-gray-800">Marseille AI Assistant</h1>
          </div>
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <HiOutlineRefresh className="text-gray-600 text-xl" />
            </button>
          </div>
        </div>

        {/* Chat content */}
        <div className="max-w-5xl mx-auto px-4 py-6">
          {id ? (
            <div className="flex flex-col space-y-6 h-[calc(100vh-180px)] overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {Array.isArray(messageDetail) && messageDetail.length > 0 ? (
                messageDetail?.map((item) => (
                  <div
                    key={item.id}
                    className={`flex ${item.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${item.isBot
                          ? 'bg-white border border-gray-200 shadow-sm text-gray-800 rounded-tl-none'
                          : 'bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 text-white rounded-tr-none'
                        }`}
                    >
                      {item.isBot ? (
                        <div className="flex items-start">
                          <BsRobot className="text-teal-500 mt-1 mr-2 flex-shrink-0" />
                          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: item.text }} />
                        </div>
                      ) : (
                        <div className="flex items-start ">
                          <BsPerson className="text-white mt-1 mr-2 flex-shrink-0" />
                          <div>{item.text}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-2xl border border-gray-200 shadow-sm max-w-lg w-full">
                    <div className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 p-4 rounded-full inline-flex mx-auto mb-5">
                      <BsChatLeftDots className="text-5xl text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 text-transparent bg-clip-text">
                      Bắt đầu trò chuyện với Marseille AI
                    </h2>
                    <p className="text-gray-600 mb-6">Hãy đặt câu hỏi hoặc yêu cầu trợ giúp về bất cứ điều gì.</p>
                    <div className="flex flex-col gap-3 text-left">
                      <div className="bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setInputChat("Tôi cần giúp đỡ tìm laptop phù hợp cho sinh viên IT")}>
                        "Tôi cần giúp đỡ tìm laptop phù hợp cho sinh viên IT"
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setInputChat("So sánh Iphone 16 Promax và SS Galaxy S25 ultra")}>
                        "So sánh Iphone 16 Promax và SS Galaxy S25 ultra"
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 max-w-[80%] rounded-tl-none">
                    <div className="flex items-center space-x-2">
                      <BsRobot className="text-teal-500" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex flex-col h-[calc(100vh-180px)] items-center justify-center">
              <div className="max-w-2xl text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 text-transparent bg-clip-text">
                  Xin chào!
                </h2>
                <p className="text-xl text-gray-600 mb-8">Hôm nay tôi có thể giúp gì cho bạn?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <h3 className="font-medium text-lg mb-2 text-gray-800">Lựa chọn tốt nhất</h3>
                  <p className="text-gray-600">Gợi ý cho tôi top 5 điện thoại đáng tiền nhất trong tầm 10 đến 15 triệu</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <h3 className="font-medium text-lg mb-2 text-gray-800">Cụm từ ngôn ngữ mới</h3>
                  <p className="text-gray-600">Học và sử dụng thành ngữ, cụm từ mới trong giao tiếp</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <h3 className="font-medium text-lg mb-2 text-gray-800">Bí quyết viết thư xin việc</h3>
                  <p className="text-gray-600">Tạo CV và thư xin việc chuyên nghiệp, hiệu quả</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center">
                  <div>
                    <h3 className="font-medium text-lg mb-2 text-gray-800">Tạo hình ảnh với AI</h3>
                    <p className="text-gray-600">Mô tả ý tưởng của bạn và xem AI biến nó thành hình ảnh</p>
                  </div>
                  <img src={ImgTemp} alt="AI image example" className="w-20 h-20 ml-4 rounded-lg object-cover" />
                </div>
              </div>
            </div>
          )}

          {/* Input area */}
          <div className="sticky bottom-0 bg-gray-50 pt-4 pb-6">
            <div className="border border-gray-300 rounded-xl bg-white shadow-sm flex items-center p-1 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent">
              <textarea
                value={inputChat}
                placeholder="Nhập câu hỏi hoặc yêu cầu tại đây..."
                className="flex-1 p-3 bg-transparent border-none outline-none resize-none max-h-32"
                rows={1}
                onChange={(e) => setInputChat(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <div className="px-2 flex items-center">
                <button
                  onClick={handleChatDetail}
                  disabled={!inputChat.trim() || isLoading}
                  className={`p-2 rounded-full ${inputChat.trim() && !isLoading
                      ? 'bg-teal-500 text-white hover:bg-teal-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    } transition-colors`}
                  aria-label="Send message"
                >
                  <HiOutlinePaperAirplane className="text-xl" />
                </button>
              </div>
            </div>
            <p className="text-xs text-center text-gray-500 mt-2">
              Powered by Marseille AI • Nhấn Enter để gửi, Shift+Enter để xuống dòng
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withBase(ChatDetail);