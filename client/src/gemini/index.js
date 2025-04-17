import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { apiGetProducts } from "../api/product";
// import fs from "fs";
// import mime from "mime-types"

const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [],
  responseMimeType: "text/plain",
};

const safetySetting = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

// Hàm để lấy thông tin sản phẩm từ MongoDB
async function getProductInfo(query, sort = null, limit = 5, category = null, brand = null) {
  try {
    const params = { limit };
    if (query) params.q = query;
    if (sort) params.sort = sort;
    if (category) params.category = category;
    if (brand) params.brand = brand;
    
    console.log("API getProducts params:", params);
    const response = await apiGetProducts(params);
    console.log("API getProducts response:", response);
    
    if (response.success && response.dataProducts && response.dataProducts.length > 0) {
      return response.dataProducts;
    }
    return null;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
}

async function run(textInput, chatHistory) {
  const history = (chatHistory || []).map((item) =>{
    return{
      role: item.isBot ? 'model' : 'user',
      parts: [{text: item.text}]
    }
  })

  // Kiểm tra các loại câu hỏi đặc biệt
  const lowerInput = textInput.toLowerCase();
  const isMostExpensiveQuery = lowerInput.includes("đắt nhất");
  const isCheapestQuery = lowerInput.includes("rẻ nhất") || lowerInput.includes("giá thấp nhất");
  const isNewestQuery = lowerInput.includes("mới nhất") || lowerInput.includes("mới ra mắt");
  
  // Kiểm tra câu hỏi về thương hiệu cụ thể
  const brandKeywords = {
    "samsung": "Samsung",
    "apple": "Apple",
    "iphone": "Apple",
    "macbook": "Apple",
    "xiaomi": "Xiaomi",
    "asus": "Asus",
    "acer": "Acer",
    "dell": "Dell",
    "sony": "Sony",
    "lg": "LG",
    "nokia": "Nokia",
    "oppo": "Oppo",
    "huawei": "Huawei"
  };
  
  // Kiểm tra câu hỏi về danh mục cụ thể
  const categoryKeywords = {
    "điện thoại": "Phone",
    "điện thoại di động": "Phone",
    "smartphone": "Phone",
    "laptop": "Laptop",
    "máy tính xách tay": "Laptop",
    "máy tính": ["Laptop", "Computer"],
    "tivi": "Television",
    "ti vi": "Television",
    "tv": "Television",
    "television": "Television",
    "tai nghe": "Headphone",
    "loa": "Speaker",
    "máy tính bảng": "Tablet",
    "tablet": "Tablet",
    "ipad": "Tablet",
    "tủ lạnh": "Refrigerator",
    "máy lạnh": "Air Conditioner"
  };
  
  // Xác định thương hiệu từ câu hỏi
  let detectedBrand = null;
  for (const [keyword, brand] of Object.entries(brandKeywords)) {
    if (lowerInput.includes(keyword)) {
      detectedBrand = brand;
      break;
    }
  }
  
  // Xác định danh mục từ câu hỏi
  let detectedCategory = null;
  for (const [keyword, category] of Object.entries(categoryKeywords)) {
    if (lowerInput.includes(keyword)) {
      detectedCategory = category;
      break;
    }
  }
  
  console.log("Detected brand:", detectedBrand);
  console.log("Detected category:", detectedCategory);

  // Xử lý câu hỏi về sản phẩm đắt nhất
  if (isMostExpensiveQuery) {
    let params = { sort: '-price', limit: 1 };
    
    // Nếu có thương hiệu hoặc danh mục cụ thể
    if (detectedBrand || detectedCategory) {
      const brandText = detectedBrand ? ` của ${detectedBrand}` : "";
      const categoryText = detectedCategory ? ` thuộc danh mục ${Array.isArray(detectedCategory) ? detectedCategory[0] : detectedCategory}` : "";
      
      // Tìm sản phẩm đắt nhất theo thương hiệu/danh mục
      const mostExpensiveProduct = await getProductInfo("", '-price', 1, detectedCategory, detectedBrand);
      
      if (mostExpensiveProduct && mostExpensiveProduct.length > 0) {
        const product = mostExpensiveProduct[0];
        return `Sản phẩm đắt nhất${brandText}${categoryText} là:
        Tên sản phẩm: ${product.title}
        Giá: ${product.price.toLocaleString('vi-VN')}đ
        Thương hiệu: ${product.brand}
        Danh mục: ${product.category}`;
      } else {
        return `Xin lỗi, tôi không tìm thấy thông tin về sản phẩm đắt nhất${brandText}${categoryText} trong cơ sở dữ liệu.`;
      }
    } else {
      // Tìm sản phẩm đắt nhất tổng quát
      const mostExpensiveProduct = await getProductInfo("", '-price', 1);
      
      if (mostExpensiveProduct && mostExpensiveProduct.length > 0) {
        const product = mostExpensiveProduct[0];
        return `Sản phẩm đắt nhất trong cửa hàng là:
        Tên sản phẩm: ${product.title}
        Giá: ${product.price.toLocaleString('vi-VN')}đ
        Thương hiệu: ${product.brand}
        Danh mục: ${product.category}`;
      } else {
        return "Xin lỗi, tôi không tìm thấy thông tin về sản phẩm đắt nhất. Có thể chưa có sản phẩm nào trong cơ sở dữ liệu.";
      }
    }
  }
  
  // Xử lý câu hỏi về sản phẩm rẻ nhất
  if (isCheapestQuery) {
    let sort = 'price'; // Sắp xếp tăng dần theo giá
    let brandText = detectedBrand ? ` của ${detectedBrand}` : "";
    let categoryText = detectedCategory ? ` thuộc danh mục ${Array.isArray(detectedCategory) ? detectedCategory[0] : detectedCategory}` : "";
    
    const cheapestProduct = await getProductInfo("", sort, 1, detectedCategory, detectedBrand);
    
    if (cheapestProduct && cheapestProduct.length > 0) {
      const product = cheapestProduct[0];
      return `Sản phẩm rẻ nhất${brandText}${categoryText} là:
      Tên sản phẩm: ${product.title}
      Giá: ${product.price.toLocaleString('vi-VN')}đ
      Thương hiệu: ${product.brand}
      Danh mục: ${product.category}`;
    } else {
      return `Xin lỗi, tôi không tìm thấy thông tin về sản phẩm rẻ nhất${brandText}${categoryText} trong cơ sở dữ liệu.`;
    }
  }
  
  // Xử lý câu hỏi về sản phẩm mới nhất
  if (isNewestQuery) {
    let sort = '-createdAt'; // Sắp xếp giảm dần theo ngày tạo
    let brandText = detectedBrand ? ` của ${detectedBrand}` : "";
    let categoryText = detectedCategory ? ` thuộc danh mục ${Array.isArray(detectedCategory) ? detectedCategory[0] : detectedCategory}` : "";
    
    const newestProduct = await getProductInfo("", sort, 1, detectedCategory, detectedBrand);
    
    if (newestProduct && newestProduct.length > 0) {
      const product = newestProduct[0];
      return `Sản phẩm mới nhất${brandText}${categoryText} là:
      Tên sản phẩm: ${product.title}
      Giá: ${product.price.toLocaleString('vi-VN')}đ
      Thương hiệu: ${product.brand}
      Danh mục: ${product.category}`;
    } else {
      return `Xin lỗi, tôi không tìm thấy thông tin về sản phẩm mới nhất${brandText}${categoryText} trong cơ sở dữ liệu.`;
    }
  }

  // Kiểm tra xem câu hỏi có liên quan đến sản phẩm không
  const productKeywords = ['sản phẩm', 'điện thoại', 'laptop', 'máy tính', 'giá', 'mua', 'bán', 'tìm', 'tìm kiếm', 'tivi', 'màn hình', 'bao nhiêu'];
  const isProductQuery = productKeywords.some(keyword => 
    lowerInput.includes(keyword)
  ) || detectedBrand !== null || detectedCategory !== null;

  let productInfo = null;
  if (isProductQuery && !isMostExpensiveQuery && !isCheapestQuery && !isNewestQuery) {
    // Nếu phát hiện thương hiệu hoặc danh mục cụ thể
    if (detectedBrand || detectedCategory) {
      // Ưu tiên tìm theo thương hiệu và danh mục
      productInfo = await getProductInfo("", null, 5, detectedCategory, detectedBrand);
    } else {
      // Trích xuất từ khóa chính từ câu hỏi (cách cũ)
      const extractKeywords = (question) => {
        // Loại bỏ các từ/cụm từ thông dụng trong câu hỏi
        const removeWords = ['giá của', 'giá', 'là bao nhiêu', 'bao nhiêu tiền', 
                            'tìm kiếm', 'tìm', 'sản phẩm', 'có những', 'có gì',
                            'như thế nào', 'ra sao', 'cho tôi xem', 'cho tôi biết về'];
        let result = question.toLowerCase();
        removeWords.forEach(word => {
          result = result.replace(word, '');
        });
        return result.trim();
      };
      
      const searchKeyword = extractKeywords(textInput);
      console.log("Extracted search keyword:", searchKeyword);
      
      productInfo = await getProductInfo(searchKeyword);
    }
    console.log("Product info found:", productInfo);
  }

  const chatSession = model.startChat({
    generationConfig,
    safetySetting,
    history: history,
  });

  // Thêm thông tin sản phẩm vào prompt nếu có
  let prompt = textInput;
  if (productInfo) {
    const productDetails = productInfo.map(product => `
      Tên sản phẩm: ${product.title}
      Giá: ${product.price.toLocaleString('vi-VN')}đ
      Thương hiệu: ${product.brand}
      Danh mục: ${product.category}
      Mô tả: ${product.description && product.description.length > 0 ? product.description[0] : "Không có mô tả"}
    `).join('\n');
    
    prompt = `Dựa vào thông tin sản phẩm sau đây, hãy trả lời câu hỏi: ${textInput}

Thông tin sản phẩm:
${productDetails}

Hãy trả lời ngắn gọn, cụ thể và chính xác dựa trên thông tin sản phẩm được cung cấp. Nếu câu hỏi hỏi về một thương hiệu cụ thể, hãy chỉ đề cập đến sản phẩm thuộc thương hiệu đó.`;
  } else if (isProductQuery) {
    // Nếu đây là câu hỏi về sản phẩm nhưng không tìm thấy thông tin
    let brandText = detectedBrand ? ` ${detectedBrand}` : "";
    let categoryText = detectedCategory ? ` ${Array.isArray(detectedCategory) ? detectedCategory[0] : detectedCategory}` : "";
    
    prompt = `${textInput}

Lưu ý: Tôi không tìm thấy thông tin về sản phẩm${brandText}${categoryText} trong cơ sở dữ liệu. Hãy thông báo cho người dùng rằng không có dữ liệu và đề xuất họ thử tìm kiếm với từ khóa cụ thể hơn, chẳng hạn như "Điện thoại Samsung", "Tivi Sony", "Laptop Asus" để có kết quả chính xác hơn.`;
  }

  const result = await chatSession.sendMessage(prompt);
  return result.response.text();
}

export default run;