/**
 * contextAnalyzer.js
 * Module để phân tích ngữ cảnh và xác định loại prompt phù hợp
 */

import { categoryKeywordsRegex, brandKeywordsRegex, determineCollections } from './utils';

/**
 * Phân loại loại truy vấn dựa trên nội dung
 * @param {string} query - Câu hỏi của người dùng
 * @returns {string} - Loại truy vấn: 'product_info', 'comparison', 'recommendation', 'faq'
 */
export const classifyQueryType = (query) => {
  const lowerQuery = query.toLowerCase();
  
  // Kiểm tra xem đây có phải là yêu cầu so sánh không
  if (
    lowerQuery.includes('so sánh') ||
    lowerQuery.includes('đối chiếu') || 
    lowerQuery.includes('khác nhau') || 
    lowerQuery.includes('khác biệt') ||
    lowerQuery.match(/giữa|và|hay|or|hoặc|với|between|hay nên chọn/i) &&
    lowerQuery.match(/nào|which|better|tốt hơn|nên mua/i)
  ) {
    return 'comparison';
  }
  
  // Kiểm tra xem đây có phải là yêu cầu gợi ý sản phẩm không
  if (
    lowerQuery.includes('gợi ý') ||
    lowerQuery.includes('đề xuất') ||
    lowerQuery.includes('recommendation') ||
    lowerQuery.includes('nên mua') ||
    lowerQuery.includes('sản phẩm nào') ||
    lowerQuery.includes('tư vấn') ||
    lowerQuery.match(/top|best|tốt nhất|phù hợp|suggest/i) &&
    !lowerQuery.includes('so sánh')
  ) {
    return 'recommendation';
  }
  
  // Kiểm tra xem đây có phải là câu hỏi thường gặp không
  if (
    lowerQuery.includes('chính sách') ||
    lowerQuery.includes('bảo hành') ||
    lowerQuery.includes('đổi trả') ||
    lowerQuery.includes('thanh toán') ||
    lowerQuery.includes('vận chuyển') ||
    lowerQuery.includes('giao hàng') ||
    lowerQuery.includes('cửa hàng') ||
    lowerQuery.includes('mở cửa') ||
    lowerQuery.includes('giờ làm việc') ||
    lowerQuery.includes('liên hệ') ||
    lowerQuery.includes('khuyến mãi') ||
    lowerQuery.includes('ưu đãi')
  ) {
    return 'faq';
  }
  
  // Mặc định là truy vấn thông tin sản phẩm
  return 'product_info';
};

/**
 * Trích xuất từ khóa quan trọng từ câu truy vấn
 * @param {string} query - Câu hỏi của người dùng
 * @returns {Object} - Các từ khóa quan trọng (danh mục, thương hiệu, tính năng)
 */
export const extractKeywords = (query) => {
  const lowerQuery = query.toLowerCase();
  let keywords = {
    category: null,
    brand: null,
    features: [],
    priceRange: null
  };
  
  // Trích xuất danh mục
  for (const [regex, category] of Object.entries(categoryKeywordsRegex)) {
    if (new RegExp(regex, 'i').test(lowerQuery)) {
      keywords.category = category;
      break;
    }
  }
  
  // Trích xuất thương hiệu
  for (const [regex, brand] of Object.entries(brandKeywordsRegex)) {
    if (new RegExp(regex, 'i').test(lowerQuery)) {
      keywords.brand = brand;
      break;
    }
  }
  
  // Trích xuất tính năng
  const featureKeywords = [
    'pin', 'battery', 'camera', 'màn hình', 'screen', 'display', 
    'cpu', 'chip', 'processor', 'ram', 'bộ nhớ', 'memory', 'storage',
    'gaming', 'kết nối', 'connectivity', 'sạc', 'charging', 'wifi',
    'bluetooth', 'chống nước', 'waterproof', 'bàn phím', 'keyboard',
    'chuột', 'mouse', 'loa', 'speaker', 'tai nghe', 'headphone'
  ];
  
  keywords.features = featureKeywords.filter(feature => 
    lowerQuery.includes(feature)
  );
  
  // Trích xuất khoảng giá
  const priceRangeRegex = /(\d+)\s*(triệu|tr|k|nghìn|ngàn)\s*(?:đến|tới|~|-|đến)\s*(\d+)\s*(triệu|tr|k|nghìn|ngàn)/i;
  const priceMatch = lowerQuery.match(priceRangeRegex);
  
  if (priceMatch) {
    let minValue = parseInt(priceMatch[1]);
    let maxValue = parseInt(priceMatch[3]);
    const minUnit = priceMatch[2].toLowerCase();
    const maxUnit = priceMatch[4].toLowerCase();
    
    // Chuyển đổi thành giá trị VND
    if (minUnit === 'triệu' || minUnit === 'tr') minValue *= 1000000;
    else if (minUnit === 'k' || minUnit === 'nghìn' || minUnit === 'ngàn') minValue *= 1000;
    
    if (maxUnit === 'triệu' || maxUnit === 'tr') maxValue *= 1000000;
    else if (maxUnit === 'k' || maxUnit === 'nghìn' || maxUnit === 'ngàn') maxValue *= 1000;
    
    keywords.priceRange = { min: minValue, max: maxValue };
  }
  
  return keywords;
};

/**
 * Xác định loại prompt cần sử dụng dựa trên loại truy vấn và các từ khóa
 * @param {string} query - Câu hỏi của người dùng 
 * @param {Array} retrievedDocs - Tài liệu được truy xuất
 * @returns {string} - Loại prompt nên sử dụng
 */
export const determinePromptType = (query, retrievedDocs = []) => {
  // Xác định loại truy vấn
  const queryType = classifyQueryType(query);
  
  // Xác định collections cần tìm kiếm
  const collections = determineCollections(query);
  
  // Nếu truy xuất được FAQ docs, ưu tiên sử dụng prompt FAQ
  const hasFaqDocs = retrievedDocs.some(doc => 
    doc.type === 'faq' || 
    (typeof doc.content === 'string' && doc.content.includes('question'))
  );
  
  if (hasFaqDocs && queryType === 'faq') {
    return 'faq';
  }
  
  // Áp dụng logic dựa trên loại truy vấn
  switch (queryType) {
    case 'comparison':
      return 'comparison';
    case 'recommendation':
      return 'recommendation';
    case 'faq':
      return 'faq';
    case 'product_info':
    default:
      return 'product_info';
  }
};

/**
 * Lọc tài liệu phù hợp dựa trên từ khóa và loại prompt
 * @param {Array} retrievedDocs - Tài liệu được truy xuất
 * @param {string} promptType - Loại prompt sẽ sử dụng
 * @param {Object} keywords - Từ khóa đã được trích xuất từ truy vấn
 * @returns {Array} - Tài liệu đã được lọc và sắp xếp theo độ phù hợp
 */
export const filterRelevantDocs = (retrievedDocs, promptType, keywords) => {
  if (!retrievedDocs || retrievedDocs.length === 0) {
    return [];
  }
  
  // Sao chép mảng để không làm thay đổi mảng gốc
  let filteredDocs = [...retrievedDocs];
  
  // Lọc theo loại tài liệu nếu có thể
  if (promptType === 'faq') {
    const faqDocs = filteredDocs.filter(doc => 
      doc.type === 'faq' || 
      (typeof doc.content === 'string' && doc.content.includes('question'))
    );
    if (faqDocs.length > 0) {
      filteredDocs = faqDocs;
    }
  }
  
  // Lọc theo danh mục và thương hiệu nếu có
  if (keywords.category || keywords.brand) {
    filteredDocs = filteredDocs.filter(doc => {
      try {
        const content = typeof doc.content === 'string' 
          ? JSON.parse(doc.content) 
          : doc.content;
        
        const matchesCategory = !keywords.category || 
          (content.category && content.category.includes(keywords.category));
        
        const matchesBrand = !keywords.brand || 
          (content.brand && content.brand.toLowerCase() === keywords.brand.toLowerCase());
        
        return matchesCategory || matchesBrand;
      } catch (error) {
        // Nếu không thể phân tích cú pháp, giữ lại tài liệu
        return true;
      }
    });
  }
  
  // Lọc theo khoảng giá nếu có
  if (keywords.priceRange) {
    filteredDocs = filteredDocs.filter(doc => {
      try {
        const content = typeof doc.content === 'string' 
          ? JSON.parse(doc.content) 
          : doc.content;
        
        return content.price && 
          content.price >= keywords.priceRange.min && 
          content.price <= keywords.priceRange.max;
      } catch (error) {
        // Nếu không thể phân tích cú pháp, giữ lại tài liệu
        return true;
      }
    });
  }
  
  // Nếu không còn tài liệu nào sau khi lọc, quay lại tài liệu gốc
  if (filteredDocs.length === 0) {
    return retrievedDocs;
  }
  
  return filteredDocs;
}; 