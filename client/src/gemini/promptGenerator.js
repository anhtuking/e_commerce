/**
 * promptGenerator.js
 * Module chuyên về tạo các prompt có cấu trúc cho Gemini API
 */

import { categoryVietnameseNames, categoryKeywordsRegex, brandKeywordsRegex } from './utils';

/**
 * Tạo prompt chi tiết cho sản phẩm
 * @param {string} query - Câu hỏi của người dùng
 * @param {Array} productDocs - Dữ liệu sản phẩm đã được truy xuất
 * @returns {string} - Prompt được tối ưu hóa
 */
export const createProductDetailPrompt = (query, productDocs = []) => {
  if (!productDocs || productDocs.length === 0) {
    return createFallbackPrompt(query);
  }

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
${product.specs ? `Thông số kỹ thuật: ${JSON.stringify(product.specs)}` : ''}
${product.color ? `Màu sắc: ${product.color}` : ''}
${product.quantity !== undefined ? `Tình trạng: ${product.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}` : ''}
${product.warranty ? `Bảo hành: ${product.warranty}` : ''}
${product.discount ? `Giảm giá: ${product.discount}%` : ''}
${product.rating ? `Đánh giá: ${product.rating}/5` : ''}
`;
    } catch (error) {
      return content;
    }
  };

  // Tạo phần ngữ cảnh từ các tài liệu truy xuất được
  const context = `Thông tin sản phẩm tham khảo:
${productDocs.map((doc, index) => `[Sản phẩm ${index + 1}]: ${formatProductInfo(doc.content)}`).join('\n\n')}`;

  // Tạo prompt
  return `
Bạn là trợ lý AI chuyên nghiệp của cửa hàng điện tử Marseille.

${context}

Hướng dẫn nhiệm vụ:
1. Trả lời dựa trên thông tin sản phẩm được cung cấp ở trên
2. Nếu câu hỏi liên quan đến giá cả, chính sách bảo hành, thông số kỹ thuật - CHỈ sử dụng dữ liệu chính xác từ thông tin sản phẩm
3. Dùng ngôn ngữ thân thiện, rõ ràng và ngắn gọn, như nhân viên bán hàng chuyên nghiệp
4. Nếu không chắc chắn về thông tin, hãy nói rõ và đề xuất liên hệ nhân viên
5. TUYỆT ĐỐI KHÔNG đưa ra thông tin sai lệch về sản phẩm
6. Không cần giới thiệu bản thân, trả lời trực tiếp vào câu hỏi
7. Trả lời rõ ràng, đúng trọng tâm và ngắn gọn

Câu hỏi của khách hàng: ${query}
`;
};

/**
 * Tạo prompt so sánh sản phẩm
 * @param {string} query - Câu hỏi của người dùng
 * @param {Array} productDocs - Dữ liệu sản phẩm đã được truy xuất
 * @returns {string} - Prompt được tối ưu hóa
 */
export const createProductComparisonPrompt = (query, productDocs = []) => {
  if (productDocs.length < 2) {
    return createProductDetailPrompt(query, productDocs);
  }

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
${product.specs ? `Thông số kỹ thuật: ${JSON.stringify(product.specs)}` : ''}
${product.color ? `Màu sắc: ${product.color}` : ''}
${product.quantity !== undefined ? `Tình trạng: ${product.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}` : ''}
${product.warranty ? `Bảo hành: ${product.warranty}` : ''}
${product.discount ? `Giảm giá: ${product.discount}%` : ''}
${product.rating ? `Đánh giá: ${product.rating}/5` : ''}
`;
    } catch (error) {
      return content;
    }
  };

  // Tạo phần ngữ cảnh từ các tài liệu truy xuất được
  const context = `Thông tin sản phẩm cần so sánh:
${productDocs.map((doc, index) => `[Sản phẩm ${index + 1}]: ${formatProductInfo(doc.content)}`).join('\n\n')}`;

  // Tạo prompt
  return `
Bạn là trợ lý AI chuyên nghiệp của cửa hàng điện tử Marseille.

${context}

Hướng dẫn nhiệm vụ:
1. Hãy so sánh chi tiết các sản phẩm được cung cấp ở trên theo yêu cầu của khách hàng
2. Nêu rõ điểm mạnh, điểm yếu của từng sản phẩm, tập trung vào:
   - Hiệu năng/cấu hình
   - Giá cả và tính năng nổi bật
   - Ưu điểm và nhược điểm rõ rệt
3. Kết luận nên chọn sản phẩm nào phù hợp với nhu cầu cụ thể (nếu có thể xác định từ câu hỏi)
4. Sử dụng bảng so sánh nếu cần thiết cho các thông số kỹ thuật quan trọng
5. TUYỆT ĐỐI KHÔNG đưa ra thông tin sai lệch về sản phẩm
6. Trả lời rõ ràng, đúng trọng tâm và ngắn gọn

Câu hỏi so sánh: ${query}
`;
};

/**
 * Tạo prompt gợi ý sản phẩm
 * @param {string} query - Câu hỏi của người dùng
 * @param {Array} productDocs - Dữ liệu sản phẩm đã được truy xuất
 * @returns {string} - Prompt được tối ưu hóa
 */
export const createProductRecommendationPrompt = (query, productDocs = []) => {
  if (!productDocs || productDocs.length === 0) {
    return createFallbackPrompt(query);
  }

  // Xử lý thông tin sản phẩm
  const formatProductInfo = (content) => {
    try {
      const product = typeof content === 'string' ? JSON.parse(content) : content;
      return `
Tên: ${product.title || 'Không có thông tin'}
Giá: ${product.price ? `${product.price.toLocaleString('vi-VN')}đ` : 'Liên hệ'}
Mô tả ngắn: ${product.short_description || product.description?.substring(0, 100) || 'Không có thông tin'}
Thương hiệu: ${product.brand || 'Không có thông tin'}
${product.category ? `Danh mục: ${product.category}` : ''}
${product.price ? `Giá: ${product.price.toLocaleString('vi-VN')}đ` : ''}
${product.rating ? `Đánh giá: ${product.rating}/5` : ''}
`;
    } catch (error) {
      return content;
    }
  };

  // Tạo phần ngữ cảnh từ các tài liệu truy xuất được
  const context = `Danh sách sản phẩm có thể gợi ý:
${productDocs.map((doc, index) => `[Sản phẩm ${index + 1}]: ${formatProductInfo(doc.content)}`).join('\n\n')}`;

  // Tạo prompt
  return `
Bạn là trợ lý AI chuyên nghiệp của cửa hàng điện tử Marseille.

${context}

Hướng dẫn nhiệm vụ:
1. Dựa vào yêu cầu của khách hàng và danh sách sản phẩm được cung cấp, hãy gợi ý top 3-5 sản phẩm phù hợp nhất
2. Giải thích ngắn gọn tại sao mỗi sản phẩm phù hợp với nhu cầu của khách hàng
3. Sắp xếp theo thứ tự phù hợp nhất
4. Nêu rõ ưu điểm nổi bật của mỗi sản phẩm được gợi ý
5. TUYỆT ĐỐI KHÔNG đưa ra thông tin sai lệch về sản phẩm
6. Trả lời rõ ràng, đúng trọng tâm và ngắn gọn

Yêu cầu của khách hàng: ${query}
`;
};

/**
 * Tạo prompt trả lời câu hỏi thường gặp
 * @param {string} query - Câu hỏi của người dùng
 * @param {Array} faqDocs - Dữ liệu FAQ đã được truy xuất
 * @returns {string} - Prompt được tối ưu hóa
 */
export const createFAQPrompt = (query, faqDocs = []) => {
  if (!faqDocs || faqDocs.length === 0) {
    return createFallbackPrompt(query);
  }

  // Xử lý thông tin FAQ
  const formatFAQInfo = (content) => {
    try {
      const faq = typeof content === 'string' ? JSON.parse(content) : content;
      return `
Câu hỏi: ${faq.question || 'Không có thông tin'}
Trả lời: ${faq.answer || 'Không có thông tin'}
${faq.category ? `Danh mục: ${faq.category}` : ''}
`;
    } catch (error) {
      return content;
    }
  };

  // Tạo phần ngữ cảnh từ các tài liệu truy xuất được
  const context = `Thông tin FAQ tham khảo:
${faqDocs.map((doc, index) => `[FAQ ${index + 1}]: ${formatFAQInfo(doc.content)}`).join('\n\n')}`;

  // Tạo prompt
  return `
Bạn là trợ lý AI chuyên nghiệp của cửa hàng điện tử Marseille.

${context}

Hướng dẫn nhiệm vụ:
1. Dựa vào các thông tin FAQ được cung cấp, hãy trả lời câu hỏi của khách hàng
2. Nếu không có thông tin chính xác, hãy nói rõ và đề xuất liên hệ nhân viên
3. Dùng ngôn ngữ thân thiện, rõ ràng và ngắn gọn
4. TUYỆT ĐỐI KHÔNG đưa ra thông tin sai lệch
5. Trả lời rõ ràng, đúng trọng tâm và ngắn gọn

Câu hỏi của khách hàng: ${query}
`;
};

/**
 * Tạo prompt dự phòng khi không có dữ liệu tham khảo
 * @param {string} query - Câu hỏi của người dùng
 * @returns {string} - Prompt dự phòng
 */
export const createFallbackPrompt = (query) => {
  return `
Bạn là trợ lý AI chuyên nghiệp của cửa hàng điện tử Marseille.

Hướng dẫn nhiệm vụ:
1. Trả lời câu hỏi của khách hàng một cách chung chung
2. Nếu câu hỏi liên quan đến thông tin sản phẩm cụ thể mà bạn không có dữ liệu, hãy nói rõ "Tôi không có thông tin chi tiết về sản phẩm này" và đề xuất khách hàng liên hệ nhân viên
3. Đối với câu hỏi chung về công nghệ, hãy cung cấp thông tin hữu ích nhất có thể
4. Dùng ngôn ngữ thân thiện, rõ ràng và ngắn gọn, như nhân viên bán hàng chuyên nghiệp
5. Nếu không chắc chắn về thông tin, hãy nói rõ và đề xuất liên hệ nhân viên
6. Không cần giới thiệu bản thân, trả lời trực tiếp vào câu hỏi
7. Trả lời rõ ràng, đúng trọng tâm và ngắn gọn

Câu hỏi của khách hàng: ${query}
`;
}; 