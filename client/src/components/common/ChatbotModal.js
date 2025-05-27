import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { addMessage, setNameChat, closeModal, setMessageFeedback } from "store/chat/chatSlice";
import { HiOutlinePaperAirplane, HiX, HiThumbUp, HiThumbDown } from "react-icons/hi";
import { BsChatLeftDots, BsRobot, BsPerson } from "react-icons/bs";
import { getGeminiResponse } from "gemini";
import { getProductInfo, getSimilarProductsRAG, getContextFromMultipleCollections, determineCollections, getCheapestAndMostExpensiveProducts } from "gemini/utils";
import { apiSaveFeedback, apiFindSimilarResponse } from "api/chat";
import ChatBotSidebar from "../sidebar/ChatBotSidebar";
import IconMenu from "assets/menu.png";
import withBase from "hocs/withBase";
import { v4 as uuidv4 } from 'uuid';

const ChatbotModal = ({ dispatch }) => {
  const [menuToggle, setMenuToggle] = useState(false);
  const [dataDetail, setDataDetail] = useState([]);
  const [messageDetail, setMessageDetail] = useState([]);
  const [inputChat, setInputChat] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState([]);
  const messagesEndRef = useRef(null);
  const { data, isModalOpen, activeChatId } = useSelector((state) => state.chat);
  const { isLoggedIn, current } = useSelector((state) => state.user);

  useEffect(() => {
    if (data?.length > 0 && activeChatId) {
      const chat = data.find((chat) => chat.id === activeChatId);
      if (chat) {
        setDataDetail(chat);
        setMessageDetail(chat.messages);
      }
    }
  }, [data, activeChatId]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messageDetail]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Hàm xử lý phản hồi (like/dislike)
  const handleFeedback = async (messageId, feedbackType) => {
    try {
      // Tìm message trong state
      const message = messageDetail.find(msg => msg.id === messageId);
      if (!message || !message.isBot) return;

      // Cập nhật UI trước
      dispatch(setMessageFeedback({
        messageId,
        feedbackType: feedbackType === 'like' ? 1 : 0,
        chatId: activeChatId
      }));

      // Lấy thông tin cần lưu
      const query = message.query;
      const response = message.text;
      const productIds = message.responseStats?.sources?.map(source => source.id) || [];
      const retrievedDocs = message.responseStats?.sources?.map(source => ({
        id: source.id,
        title: source.title,
        type: 'product'
      })) || [];

      // Gửi phản hồi lên server
      await apiSaveFeedback({
        query,
        response,
        rating: feedbackType === 'like' ? 1 : 0,
        productIds,
        retrievedDocs
      });

      console.log(`Đã lưu phản hồi ${feedbackType} cho tin nhắn: ${messageId}`);
    } catch (error) {
      console.error("Lỗi khi lưu phản hồi:", error);
    }
  };

  // Hàm lấy dữ liệu liên quan từ RAG
  const fetchRelevantDocs = async (query) => {
    try {
      // Phân tích truy vấn để xác định số lượng sản phẩm cần lấy
      const hasComparisonWords = /so sánh|đối chiếu|khác nhau|khác biệt|tốt hơn/i.test(query);
      const hasCheapest = /rẻ nhất|giá thấp nhất|min price|cheapest/i.test(query);
      const hasExpensive = /đắt nhất|giá cao nhất|max price|most expensive/i.test(query);
      const limit = hasComparisonWords ? 3 : 5; // Lấy nhiều sản phẩm hơn nếu là so sánh
      
      // Nếu hỏi về sản phẩm rẻ nhất/đắt nhất
      if (hasCheapest || hasExpensive) {
        const { cheapest, mostExpensive } = await getCheapestAndMostExpensiveProducts(1);
        let docs = [];
        if (hasCheapest && cheapest.length > 0) {
          docs.push({ content: JSON.stringify(cheapest[0]), id: cheapest[0]._id, type: 'product' });
        }
        if (hasExpensive && mostExpensive.length > 0) {
          docs.push({ content: JSON.stringify(mostExpensive[0]), id: mostExpensive[0]._id, type: 'product' });
        }
        return docs;
      }
      
      // Xác định collections cần tìm kiếm dựa trên câu hỏi
      const collections = determineCollections(query);
      
      // Nếu cần tìm trong nhiều collections
      if (collections.length > 1) {
        const multiResults = await getContextFromMultipleCollections(query, collections);
        if (multiResults && multiResults.length > 0) {
          return multiResults.map(item => ({
            content: JSON.stringify(item.document),
            id: item.document._id,
            type: item.collection
          }));
        }
      }
      
      // Tìm kiếm sản phẩm tương tự bằng RAG (Embeddings)
      const similarProducts = await getSimilarProductsRAG(query, limit);
      
      if (similarProducts && similarProducts.length > 0) {
        console.log("Tìm thấy sản phẩm từ embeddings:", similarProducts.length);
        return similarProducts.map(product => ({
          content: JSON.stringify(product),
          id: product._id,
          type: 'product'
        }));
      }
      
      // Fallback: Sử dụng tìm kiếm thông thường nếu không có kết quả từ RAG
      const productInfo = await getProductInfo(query, { limit });
      
      if (!productInfo || productInfo.length === 0) {
        // Nếu không tìm thấy sản phẩm, thử tìm kiếm với các từ khóa chính
        const keywords = query
          .toLowerCase()
          .replace(/[^\p{L}\p{N}\s]/gu, '')
          .split(/\s+/)
          .filter(word => word.length > 3)
          .slice(0, 3)
          .join(' ');
          
        if (keywords) {
          const alternativeProducts = await getProductInfo(keywords, { limit: 3 });
          if (alternativeProducts && alternativeProducts.length > 0) {
            console.log("Tìm thấy sản phẩm thay thế:", alternativeProducts.length);
            return alternativeProducts.map(product => ({
              content: JSON.stringify(product),
              id: product._id,
              type: 'product'
            }));
          }
        }
        
        console.log("Không tìm thấy sản phẩm liên quan");
        return [];
      }
      
      console.log("Tìm thấy sản phẩm từ tìm kiếm thông thường:", productInfo.length);
      return productInfo.map(product => ({
        content: JSON.stringify(product),
        id: product._id,
        type: 'product'
      }));
    } catch (error) {
      console.error("Error fetching relevant documents:", error);
      return [];
    }
  };

  // Hàm lấy tiêu đề cho cuộc trò chuyện mới
  const getChatTitle = async (query) => {
    try {
      // Sử dụng getGeminiResponse với prompt đơn giản để lấy tiêu đề
      const promptName = `Đây là một cuộc trò chuyện mới và người dùng hỏi về ${query}. Không trả lời và bình luận chỉ cần cho tôi một cái tên cho cuộc trò chuyện này, độ dài tối đa là 20 ký tự`;
      
      const { text } = await getGeminiResponse(promptName, [], {});
      return text;
    } catch (error) {
      console.error("Error generating chat title:", error);
      return "Cuộc trò chuyện mới";
    }
  };

  const handleChatDetail = async () => {
    if (!inputChat.trim() || !isLoggedIn) return;
    if (activeChatId) {
      setIsLoading(true);
      try {
        // Lưu câu hỏi người dùng hiện tại
        const userQuestion = inputChat;
        
        // Thêm tin nhắn người dùng trước để UI phản hồi nhanh
        dispatch(addMessage({
          chatId: activeChatId,
          message: {
            id: uuidv4(),
            text: userQuestion,
            isBot: false
          }
        }));
        
        // Kiểm tra xem có câu trả lời tương tự đã được đánh giá cao không
        const similarResponse = await apiFindSimilarResponse({ query: userQuestion });
        
        if (similarResponse.success && similarResponse.found) {
          console.log('Tìm thấy câu trả lời tương tự được đánh giá cao:', similarResponse.data);
          
          // Cập nhật tin nhắn với câu trả lời tương tự
          dispatch(addMessage({
            chatId: activeChatId,
            message: {
              id: uuidv4(),
              text: similarResponse.data.response,
              isBot: true,
              responseStats: {
                fromCache: true,
                similarity: similarResponse.data.similarity,
                originalQuery: similarResponse.data.query
              }
            }
          }));
          
          setInputChat("");
          setIsLoading(false);
          return;
        }
        
        // Nếu không tìm thấy câu trả lời tương tự, tiếp tục quy trình bình thường
        // Lấy dữ liệu liên quan từ hệ thống RAG
        const relevantDocs = await fetchRelevantDocs(userQuestion);
        
        // Nếu là cuộc trò chuyện mới, đặt tên cho nó
        if (dataDetail.title === 'Chat') {
          const newTitle = await getChatTitle(userQuestion);
          dispatch(setNameChat({ chatTitle: newTitle, chatId: activeChatId }));
        }
        
        // Gọi API với hệ thống prompt mới
        const { text, responseStats } = await getGeminiResponse(
          userQuestion, 
          relevantDocs,
          {}
        );
        
        // Lưu nguồn dữ liệu nếu có
        if (responseStats && responseStats.sources) {
          setSources(responseStats.sources);
        }
        
        // Tạo dữ liệu tin nhắn với thông tin bổ sung
        dispatch(addMessage({
          chatId: activeChatId,
          message: {
            id: uuidv4(),
            text: text,
            isBot: true,
            responseStats
          }
        }));
        setInputChat("");
      } catch (error) {
        console.error("Error in chat:", error);
        
        // Thêm thông báo lỗi nếu có vấn đề
        dispatch(addMessage({
          chatId: activeChatId,
          message: {
            id: uuidv4(),
            text: "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.",
            isBot: true
          }
        }));
        
        setInputChat("");
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

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  // Formatting message content after render
  useEffect(() => {
    // Add icon and styling to code blocks
    const codeBlocks = document.querySelectorAll('.chat-message-content pre');
    codeBlocks.forEach(block => {
      if (!block.querySelector('.code-header')) {
        const header = document.createElement('div');
        header.className = 'code-header flex items-center justify-between bg-gray-100 px-4 py-2 rounded-t-lg border-b border-gray-200';
        
        const leftContent = document.createElement('div');
        leftContent.className = 'flex items-center';
        
        const codeIcon = document.createElement('span');
        codeIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" class="text-gray-700 mr-2"><path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z"/></svg>';
        
        const codeType = document.createElement('span');
        codeType.className = 'text-sm font-medium text-gray-700';
        codeType.textContent = 'Code';
        
        leftContent.appendChild(codeIcon);
        leftContent.appendChild(codeType);
        
        header.appendChild(leftContent);
        
        // Insert the header before the code block
        block.style.borderTopLeftRadius = '0';
        block.style.borderTopRightRadius = '0';
        block.style.marginTop = '0';
        block.parentNode.insertBefore(header, block);
      }
    });

    // Enhance blockquotes
    const blockquotes = document.querySelectorAll('.chat-message-content blockquote');
    blockquotes.forEach(quote => {
      if (!quote.querySelector('.blockquote-icon')) {
        const icon = document.createElement('div');
        icon.className = 'blockquote-icon flex items-center mb-2';
        icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" class="text-blue-600 mr-2"><path d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 9 7.558V11a1 1 0 0 0 1 1h2Zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 3 7.558V11a1 1 0 0 0 1 1h2Z"/></svg><span class="text-blue-700 font-medium">Note</span>';
        
        // Only add if it doesn't already have one
        if (!quote.querySelector('.blockquote-icon')) {
          quote.insertBefore(icon, quote.firstChild);
        }
      }
    });

    // Enhance tables
    const tables = document.querySelectorAll('.chat-message-content table');
    tables.forEach(table => {
      if (!table.parentNode.classList.contains('table-container')) {
        const tableContainer = document.createElement('div');
        tableContainer.className = 'table-container overflow-x-auto my-4 border border-gray-200 rounded-lg';
        table.parentNode.insertBefore(tableContainer, table);
        tableContainer.appendChild(table);
        table.className = 'min-w-full table-auto';
      }
    });
  }, [messageDetail]);

  if (!isModalOpen || !isLoggedIn) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl h-[80vh] rounded-xl shadow-2xl flex overflow-hidden relative">
        {/* Close button */}
        <button 
          onClick={handleCloseModal}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-purple-600 hover:bg-purple-800 transition-colors"
        >
          <HiX className="text-gray-100" />
        </button>

        {/* Sidebar */}
        <div className={`h-full transition-all duration-300 ${menuToggle ? 'w-[320px]' : 'w-0'}`}>
          {menuToggle && <ChatBotSidebar onToggle={() => setMenuToggle(!menuToggle)} />}
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col h-full">
          {/* Header */}
          <div className="bg-white border-b shadow-sm py-4 px-6 flex items-center">
            <button
              onClick={() => setMenuToggle(!menuToggle)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-3"
            >
              <img src={IconMenu} alt="menu icon" className="w-6 h-6" />
            </button>
            <div className="flex items-center justify-center place-items-center flex-1 mr-10">
              <BsRobot className="text-teal-500 text-2xl mr-2" />
              <h1 className="text-xl font-semibold text-gray-800">Marseille AI Assistant</h1>
            </div>
          </div>

          {/* Chat content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeChatId ? (
              <div className="flex flex-col space-y-6 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {Array.isArray(messageDetail) && messageDetail.length > 0 ? (
                  messageDetail?.map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex ${item.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          item.isBot
                            ? 'bg-gradient-to-br from-white to-blue-50 border border-blue-100 shadow-md text-gray-800 rounded-tl-none'
                            : 'bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 text-white rounded-tr-none'
                        }`}
                      >
                        {item.isBot ? (
                          <div className="flex items-start">
                            <div className="bg-blue-100 rounded-full p-1.5 mr-3 mt-1 flex-shrink-0">
                              <BsRobot className="text-teal-500 text-lg" />
                            </div>
                            <div className="w-full">
                              <div 
                                className="prose prose-sm max-w-none chat-message-content" 
                                dangerouslySetInnerHTML={{ __html: item.text }} 
                              />
                              
                              {/* Hiển thị nguồn dữ liệu nếu có */}
                              {item.responseStats?.sources && item.responseStats.sources.length > 0 && (
                                <div className="mt-2 text-xs text-gray-500">
                                  <p className="font-medium">Nguồn dữ liệu:</p>
                                  <ul className="mt-1">
                                    {item.responseStats.sources.map((source, idx) => (
                                      <li key={idx}>
                                        <a href={`/product/${source.id}`} className="text-blue-500 hover:underline">
                                          {source.title}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {/* Thêm UI cho phản hồi (like/dislike) */}
                              {item.isBot && (
                                <div className="mt-2 flex items-center gap-2">
                                  <span className="text-xs text-gray-500 mr-2">Câu trả lời này có hữu ích không?</span>
                                  <button 
                                    onClick={() => handleFeedback(item.id, 'like')}
                                    className={`p-1.5 rounded-full ${
                                      item.feedback === 1 
                                        ? 'bg-green-100 text-green-600' 
                                        : 'text-gray-400 hover:bg-gray-100'
                                    }`}
                                    disabled={item.feedback !== null}
                                  >
                                    <HiThumbUp className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleFeedback(item.id, 'dislike')}
                                    className={`p-1.5 rounded-full ${
                                      item.feedback === 0 
                                        ? 'bg-red-100 text-red-600' 
                                        : 'text-gray-400 hover:bg-gray-100'
                                    }`}
                                    disabled={item.feedback !== null}
                                  >
                                    <HiThumbDown className="w-4 h-4" />
                                  </button>
                                  {item.feedback === 0 && (
                                    <span className="text-xs text-gray-500">Cảm ơn phản hồi của bạn</span>
                                  )}
                                  {item.feedback === 1 && (
                                    <span className="text-xs text-gray-500">Cảm ơn phản hồi của bạn</span>
                                  )}
                                  {item.responseStats?.fromCache && (
                                    <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Trả lời nhanh</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start">
                            <div className="bg-white bg-opacity-20 rounded-full p-1.5 mr-3 mt-1 flex-shrink-0">
                              <BsPerson className="text-white text-lg" />
                            </div>
                            <div className="text-white">{item.text}</div>
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
                        <div 
                          className="bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => setInputChat("Tôi cần giúp đỡ tìm laptop phù hợp cho sinh viên IT")}
                        >
                          "Tôi cần giúp đỡ tìm laptop phù hợp cho sinh viên IT"
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 max-w-[80%] rounded-tl-none shadow-md">
                      <div className="flex items-center space-x-2">
                        <div className="bg-blue-100 rounded-full p-1.5 flex-shrink-0">
                          <BsRobot className="text-teal-500 text-lg" />
                        </div>
                        <div className="flex space-x-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex flex-col h-full items-center justify-center">
                <div className="max-w-2xl text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 text-transparent bg-clip-text">
                    Xin chào!
                  </h2>
                  <p className="text-lg text-gray-600">Hôm nay tôi có thể giúp gì cho bạn?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
                  <div
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setInputChat("Gợi ý cho tôi top 5 điện thoại đáng tiền nhất trong tầm 10 đến 15 triệu")}
                  >
                    <h3 className="font-medium text-lg mb-2 text-gray-800">Lựa chọn tốt nhất</h3>
                    <p className="text-gray-600">Gợi ý cho tôi top 5 điện thoại đáng tiền nhất trong tầm 10 đến 15 triệu</p>
                  </div>

                  <div
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setInputChat("So sánh iPhone 15 Pro Max và Samsung Galaxy S23 Ultra")}
                  >
                    <h3 className="font-medium text-lg mb-2 text-gray-800">So sánh sản phẩm</h3>
                    <p className="text-gray-600">So sánh iPhone 15 Pro Max và Samsung Galaxy S23 Ultra</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="border-t p-4 bg-white">
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
                  disabled={!inputChat.trim() || isLoading || !isLoggedIn}
                  className={`p-2 rounded-full ${
                    inputChat.trim() && !isLoading && isLoggedIn
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

export default withBase(ChatbotModal); 