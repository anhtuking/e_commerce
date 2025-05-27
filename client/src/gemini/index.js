import { GoogleGenerativeAI } from "@google/generative-ai";
import { determinePromptType, extractKeywords, filterRelevantDocs } from "./contextAnalyzer";
import {
  createProductDetailPrompt, 
  createProductComparisonPrompt, 
  createProductRecommendationPrompt,
  createFAQPrompt,
  createFallbackPrompt
} from "./promptGenerator";

// Cấu hình API key
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Tạo model và cấu hình
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

/**
 * Chọn và tạo prompt phù hợp dựa trên phân tích ngữ cảnh
 * @param {string} query - Câu hỏi của người dùng
 * @param {Array} retrievedDocs - Tài liệu được truy xuất từ hệ thống RAG
 * @returns {string} - Prompt tối ưu cho câu hỏi
 */
const createOptimizedPrompt = (query, retrievedDocs = []) => {
  // Xác định loại prompt cần sử dụng
  const promptType = determinePromptType(query, retrievedDocs);
  
  // Trích xuất từ khóa từ câu hỏi
  const keywords = extractKeywords(query);
  
  // Lọc tài liệu phù hợp
  const filteredDocs = filterRelevantDocs(retrievedDocs, promptType, keywords);
  
  // Tạo prompt dựa trên loại và dữ liệu đã lọc
  switch (promptType) {
    case 'comparison':
      return createProductComparisonPrompt(query, filteredDocs);
    case 'recommendation':
      return createProductRecommendationPrompt(query, filteredDocs);
    case 'faq':
      return createFAQPrompt(query, filteredDocs);
    case 'product_info':
    default:
      return createProductDetailPrompt(query, filteredDocs);
  }
};

/**
 * Tạo prompt đơn giản từ câu hỏi và ngữ cảnh (legacy - giữ để tương thích ngược)
 * @param {string} query - Câu hỏi của người dùng
 * @param {Array} retrievedDocs - Tài liệu được truy xuất từ hệ thống RAG
 * @returns {string} - Prompt đơn giản
 */
const createSimplePrompt = (query, retrievedDocs) => {
  // Xử lý thông tin sản phẩm
  const formatProductInfo = (content) => {
    try {
      const product = typeof content === 'string' ? JSON.parse(content) : content;
      return `
Tên: ${product.title || 'Không có thông tin'}
Giá: ${product.price ? `${product.price.toLocaleString('vi-VN')}đ` : 'Liên hệ'}
Mô tả: ${product.description || product.describe || 'Không có thông tin'}
Thương hiệu: ${product.brand || 'Không có thông tin'}
${product.category ? `Danh mục: ${product.category}` : ''}
${product.color ? `Màu sắc: ${product.color}` : ''}
${product.quantity !== undefined ? `Tình trạng: ${product.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}` : ''}
`;
    } catch (error) {
      return content;
    }
  };
  
  // Tạo phần ngữ cảnh từ các tài liệu truy xuất được
  const context = retrievedDocs.length > 0
    ? `Thông tin sản phẩm tham khảo:
${retrievedDocs.map((doc, index) => `[Sản phẩm ${index + 1}]: ${formatProductInfo(doc.content)}`).join('\n\n')}`
    : '';
  
  // Ví dụ mẫu
  const examples = `
Ví dụ cách trả lời:

Khách: "Laptop này có bảo hành bao lâu?"
Trợ lý: "Laptop Acer Aspire 5 được bảo hành chính hãng 24 tháng."

Khách: "Có màu nào khác không?"
Trợ lý: "Sản phẩm này hiện có các màu: Đen, Bạc và Xanh navy."

Khách: "So sánh giúp tôi sản phẩm này với model khác"
Trợ lý: "Dựa trên thông tin tôi có, [Tên sản phẩm A] có cấu hình mạnh hơn [Tên sản phẩm B] về [đặc điểm], nhưng giá cao hơn khoảng [số tiền]. [Tên sản phẩm B] phù hợp hơn nếu bạn cần [ưu điểm của sản phẩm B]."
`;
  
  // Tạo prompt
  return `
Bạn là trợ lý AI chuyên nghiệp của cửa hàng điện tử Marseille.

${context}

Hướng dẫn nhiệm vụ:
1. Trả lời dựa trên thông tin sản phẩm được cung cấp
2. Nếu câu hỏi liên quan đến giá cả, chính sách bảo hành, thông số kỹ thuật - CHỈ sử dụng dữ liệu chính xác từ thông tin sản phẩm
3. Dùng ngôn ngữ thân thiện, rõ ràng và ngắn gọn, như nhân viên bán hàng chuyên nghiệp
4. Nếu không chắc chắn về thông tin, hãy nói rõ và đề xuất liên hệ nhân viên
5. TUYỆT ĐỐI KHÔNG đưa ra thông tin sai lệch về sản phẩm
6. Không cần giới thiệu bản thân, trả lời trực tiếp vào câu hỏi

${examples}

Câu hỏi của khách hàng: ${query}
`;
};

/**
 * Gửi câu hỏi đến Gemini API và nhận câu trả lời
 * @param {string} query - Câu hỏi của người dùng
 * @param {Array} retrievedDocs - Tài liệu được truy xuất từ hệ thống RAG
 * @param {Object} additionalInfo - Thông tin bổ sung (không còn sử dụng)
 * @returns {Object} - Kết quả trả về từ API
 */
export const getGeminiResponse = async (query, retrievedDocs = [], additionalInfo = {}) => {
  try {
    const startTime = Date.now();
    
    // Sử dụng prompt tối ưu dựa trên phân tích ngữ cảnh thay vì prompt đơn giản
    const prompt = createOptimizedPrompt(query, retrievedDocs);
    
    // Cấu hình tham số cho model
    const generationConfig = {
      temperature: 0.2, // Giảm temperature xuống để tăng độ chính xác
      topK: 30,
      topP: 0.9,
      maxOutputTokens: 1024,
    };
    
    // Gửi prompt đến Gemini API
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });
    
    const response = result.response;
    const responseTime = Date.now() - startTime;
    
    // Tạo thông tin thống kê về câu trả lời
    const responseStats = {
      responseTime,
      tokensUsed: response.usageMetadata?.totalTokens || 0,
      promptTokens: response.usageMetadata?.promptTokenCount || 0,
      completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
      sources: retrievedDocs.map(doc => {
        try {
          const product = typeof doc.content === 'string' ? JSON.parse(doc.content) : doc.content;
          return {
            id: doc.id,
            title: product.title,
            score: 1 // Mặc định
          };
        } catch (error) {
          return { id: doc.id, score: 1 };
        }
      })
    };
    
    return {
      text: response.text(),
      responseStats
    };
  } catch (error) {
    console.error("Lỗi khi lấy phản hồi từ Gemini:", error);
    throw error;
  }
};

/**
 * Hàm Gemini legacy để tương thích ngược với mã cũ
 * @param {string} query - Câu hỏi người dùng
 * @param {Array} chatHistory - Lịch sử chat (không được sử dụng trong phiên bản mới)
 * @returns {string} - Chỉ trả về text để tương thích với mã cũ
 */
const Gemini = async (query, chatHistory = []) => {
  try {    
    // Chuyển đổi lịch sử chat thành retrievedDocs nếu có thể
    const retrievedDocs = chatHistory
      ? chatHistory
          .filter(msg => msg.isBot && msg.text)
          .map(msg => ({ content: msg.text }))
      : [];
    
    // Gọi hàm mới và chỉ trả về text
    const response = await getGeminiResponse(query, retrievedDocs);
    return response.text;
  } catch (error) {
    console.error('Lỗi khi gọi Gemini:', error);
    return 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.';
  }
};

// Export mặc định để tương thích ngược
export default Gemini;