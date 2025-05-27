import { apiGetProducts } from "../api/product";
import { apiSearchSimilarProducts, apiSearchMultipleCollections } from "../api/embedding";

// Hàm để lấy thông tin sản phẩm từ MongoDB - sử dụng options object để dễ mở rộng
export const getProductInfo = async (query, options = {}) => {
  const { sort = null, limit = 10, category = null, brand = null } = options;
  try {
    const params = { limit };
    if (query) params.q = query;
    if (sort) params.sort = sort;
    if (category) params.category = category;
    if (brand) params.brand = brand;
    
    const response = await apiGetProducts(params);
    return response.success && response.dataProducts?.length > 0 
      ? response.dataProducts : null;
  } catch (error) {
    return null;
  }
};

// Hàm để tìm kiếm sản phẩm tương tự bằng RAG
export const getSimilarProductsRAG = async (query, limit = 10) => {
  try {
    const response = await apiSearchSimilarProducts({ query, limit });
    return response.success && response.products?.length > 0 
      ? response.products : null;
  } catch (error) {
    return null;
  }
};

// Hàm để lấy context từ nhiều collections
export const getContextFromMultipleCollections = async (query, collections = ["products"]) => {
  try {
    if (!query || query.trim() === "") {
      return null;
    }
    
    // Đảm bảo collections là một mảng hợp lệ
    const validCollections = Array.isArray(collections) ? collections : ["products"];
    
    // Convert từ collections thành sourceType cho API
    const response = await apiSearchMultipleCollections({
      query,
      sourceType: validCollections.join(',')
    });
    
    if (!response) {
      return null;
    }
    
    if (!response.success) {
      return null;
    }
    
    if (!response.results || !Array.isArray(response.results)) {
      return [];
    }
    
    return response.results;
  } catch (error) {
    return [];
  }
};

// Xác định collections cần query dựa trên nội dung câu hỏi
export const determineCollections = (input) => {
  const lowerInput = input.toLowerCase();
  const collections = ["products"]; // Mặc định tìm trong products
  
  // Nếu có từ khóa liên quan đến blog/bài viết
  if (lowerInput.includes("bài viết") || 
      lowerInput.includes("blog") || 
      lowerInput.includes("news") || 
      lowerInput.includes("tin tức") ||
      lowerInput.includes("thông tin") ||
      lowerInput.includes("hướng dẫn")) {
    collections.push("blogs");
  }
  
  // Nếu có từ khóa liên quan đến mã giảm giá/khuyến mãi
  if (lowerInput.includes("mã giảm giá") || 
      lowerInput.includes("giảm giá") || 
      lowerInput.includes("khuyến mãi") ||
      lowerInput.includes("mã khuyến mãi") ||
      lowerInput.includes("coupon") || 
      lowerInput.includes("voucher") ||
      lowerInput.includes("ưu đãi")) {
    collections.push("coupons");
  }
  
  return collections;
};

// API để kiểm tra sự tồn tại của sản phẩm theo thương hiệu
export const checkBrandExists = async (brand) => {
  try {
    const response = await apiGetProducts({ brand, limit: 1 });
    return response.success && response.dataProducts?.length > 0;
  } catch (error) {
    return false;
  }
};

export const brandKeywordsRegex = {
  "samsung": "Samsung",
  "apple|iphone|macbook|ipad|mac": "Apple",
  "xiaomi|redmi|mi": "Xiaomi",
  "realme": "Realme",
  "vivo": "Vivo",
  "oppo": "Oppo",
  "huawei": "Huawei",
  "asus": "Asus",
  "acer": "Acer",
  "dell": "Dell",
  "hp": "HP",
  "lenovo": "Lenovo",
  "mac": "Mac",
  "msi": "MSI",
  "lg": "LG",
  "nokia": "Nokia",
  "sony": "Sony",
  "tcl": "TCL",
  "aqua": "Aqua"
};

// Gộp categoryKeywords và categoryKeywordsRegex thành một từ điển duy nhất
export const categoryKeywordsRegex = {
  "điện thoại|smartphone|phone|di động": "Phone",
  "laptop|máy tính|macbook": "Laptop",
  "tivi|ti vi|tv|television": "Television",
  "máy tính bảng|tablet|ipad": "Tablet",
  "tai nghe|headphone|ram|chuột|mouse|bàn phím|keyboard": "Accessories",
  "loa": "Speaker",
  "máy ảnh|camera": "Camera",
  "máy in|printer": "Printer",
};

// Map từ tên danh mục tiếng Anh sang tiếng Việt
export const categoryVietnameseNames = {
  "Phone": "điện thoại",
  "Laptop": "laptop",
  "Computer": "máy tính",
  "Television": "tivi",
  "Headphone": "tai nghe",
  "Speaker": "loa",
  "Tablet": "máy tính bảng",
  "Camera": "máy ảnh",
  "Printer": "máy in",
  "Accessories": "phụ kiện"
};

// Hàm lấy sản phẩm rẻ nhất và đắt nhất
export const getCheapestAndMostExpensiveProducts = async (limit = 1) => {
  try {
    // Lấy sản phẩm rẻ nhất
    const cheapestRes = await apiGetProducts({ sort: 'price', limit });
    // Lấy sản phẩm đắt nhất
    const expensiveRes = await apiGetProducts({ sort: '-price', limit });
    return {
      cheapest: cheapestRes.success && cheapestRes.dataProducts?.length > 0 ? cheapestRes.dataProducts : [],
      mostExpensive: expensiveRes.success && expensiveRes.dataProducts?.length > 0 ? expensiveRes.dataProducts : []
    };
  } catch (error) {
    return { cheapest: [], mostExpensive: [] };
  }
}; 