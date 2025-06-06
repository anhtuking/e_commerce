# Thông tin .env cần thiết cho RAG

# Thiết lập RAG với MongoDB Compass

## 1. Cấu hình .env file

Thêm các biến môi trường sau vào file `.env` trong thư mục `server`:

```
# API Key cho Google Generative AI / Gemini
GOOGLE_GEMINI_API_KEY=your_gemini_api_key

# Cấu hình MongoDB local
MONGODB_URI=mongodb://localhost:27017/your_database_name

# Tắt Vector Search vì dùng MongoDB Compass local
HAS_VECTOR_SEARCH=false
```

## 2. Thiết lập MongoDB với Compass

### Bước 1: Cài đặt MongoDB và MongoDB Compass

1. Tải và cài đặt [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Tải và cài đặt [MongoDB Compass](https://www.mongodb.com/try/download/compass)
3. Kết nối MongoDB Compass với MongoDB local của bạn

### Bước 2: Tạo Database và Collections

1. Mở MongoDB Compass và kết nối tới MongoDB server
2. Tạo database mới (nếu chưa có)
3. Đảm bảo có các collections cần thiết: `products`, `blogs`, `embeddings`

### Bước 3: Tạo Embeddings

1. Chạy server của bạn: `npm run dev` hoặc `yarn dev` trong thư mục server
2. Sử dụng các API để tạo embeddings:
   - `GET /api/embedding/generate-all` - Tạo embeddings cho tất cả sản phẩm
   - `GET /api/embedding/generate-all-blogs` - Tạo embeddings cho tất cả blogs

## 3. Hoạt động của RAG với MongoDB Compass

Khi sử dụng MongoDB Compass (local MongoDB) thay vì Atlas:

1. Hệ thống sẽ sử dụng phương pháp tính toán cosine similarity thủ công
2. Tất cả tính toán similarity sẽ được thực hiện trong JavaScript, không phải bởi MongoDB
3. Hiệu suất có thể chậm hơn với tập dữ liệu lớn, nhưng vẫn hoạt động tốt với tập dữ liệu nhỏ và vừa

## 4. Kiểm tra hoạt động

1. Mở ứng dụng client của bạn và thử đặt câu hỏi liên quan đến sản phẩm
2. Kiểm tra logs từ server để xác nhận rằng hệ thống đang sử dụng tính toán similarity thủ công
3. Thử đặt câu hỏi liên quan đến blog để kiểm tra tính năng tìm kiếm đa collections

## 5. Tối ưu hóa performance (Tùy chọn)

Khi tập dữ liệu lớn, bạn có thể tối ưu hóa bằng cách:

1. Thêm index thông thường cho các trường thường truy vấn trong MongoDB Compass
2. Thực hiện batching trong quá trình tạo embeddings
3. Cân nhắc nâng cấp lên MongoDB Atlas nếu tập dữ liệu rất lớn

## 6. Nâng cấp lên Vector Search trong tương lai

Nếu muốn sử dụng Vector Search chính thức, bạn có 2 lựa chọn:

1. **Chuyển lên MongoDB Atlas**: Dịch vụ đám mây với Vector Search tích hợp sẵn
2. **Nâng cấp lên MongoDB 7.0+ Enterprise**: Bản Enterprise mới nhất hỗ trợ Vector Search, nhưng yêu cầu license

## 7. Tích hợp tự động cho dữ liệu mới

Để tự động tạo embeddings khi có dữ liệu mới:

```javascript
// Trong hàm createProduct hoặc updateProduct
await generateProductEmbedding(savedProduct);
```

## Theo dõi hiệu suất

MongoDB Atlas cung cấp giao diện để theo dõi hiệu suất vector search. Bạn có thể xem:

1. Số lượng queries
2. Thời gian phản hồi trung bình 
3. Hiệu suất của index

Truy cập vào mục "Search" trong Atlas UI để xem các chỉ số này.

# Hướng dẫn thiết lập RAG (Retrieval-Augmented Generation) với Vector Search

Đây là hướng dẫn để thiết lập cơ sở dữ liệu MongoDB Atlas có hỗ trợ Vector Search, được sử dụng cho tính năng chatbot của hệ thống.

## 1. Tạo tài khoản và cụm MongoDB Atlas

1. Đăng ký và đăng nhập vào [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Tạo một cụm M0 (Free tier) hoặc cao hơn
3. Đảm bảo chọn phiên bản MongoDB >= 6.0 (Vector search yêu cầu phiên bản ít nhất là 6.0)

## 2. Thiết lập kết nối

1. Trong MongoDB Atlas, chọn mục "Database Access" và tạo user mới có quyền "Read and Write to any database"
2. Tại mục "Network Access", thêm địa chỉ IP của bạn hoặc cho phép truy cập từ mọi nơi (0.0.0.0/0)
3. Trong mục "Database", nhấn vào nút "Connect" và chọn "Connect your application"
4. Sao chép connection string và lưu lại 

## 3. Cấu hình biến môi trường

Tạo hoặc cập nhật file `.env` trong thư mục server với các biến sau:

```
# MongoDB Compass (local database)
MONGODB_URI=mongodb://localhost:27017/your-database-name

# MongoDB Atlas (for vector search)
MONGODB_ATLAS_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# Toggle vector search feature
HAS_VECTOR_SEARCH=true

# Gemini API key for embeddings
GOOGLE_GEMINI_API_KEY=your-gemini-api-key
```

## 4. Tạo vector index trong MongoDB Atlas

1. Trong giao diện MongoDB Atlas, chọn database của bạn
2. Hệ thống sẽ tạo 3 collections riêng biệt:
   - **ProductEmbedding**: Lưu embeddings cho sản phẩm
   - **BlogEmbedding**: Lưu embeddings cho blog
   - **CouponEmbedding**: Lưu embeddings cho coupon

3. Với mỗi collection, cần tạo vector index:
   - Mở collection (ví dụ: ProductEmbedding)
   - Chọn tab "Search" và nhấn "Create Search Index"
   - Chọn "JSON Editor" và sử dụng cấu hình sau:

```json
{
  "mappings": {
    "dynamic": true,
    "fields": {
      "embedding": {
        "dimensions": 768,
        "similarity": "cosine",
        "type": "vector"
      }
    }
  }
}
```

4. Đặt tên cho index là "vector_index" và nhấn "Create"
5. Lặp lại bước 3-4 cho mỗi collection (BlogEmbedding và CouponEmbedding)

## 5. Đồng bộ dữ liệu

1. Khởi động lại server để áp dụng cấu hình mới
2. Đăng nhập vào trang admin và truy cập phần "Quản lý Embeddings"
3. Sử dụng nút "Đồng bộ tất cả Embeddings" để tạo và lưu embeddings cho tất cả sản phẩm, blogs và coupons vào MongoDB Atlas

## 6. Kiểm tra kết quả

Sau khi đồng bộ xong, hệ thống chatbot của bạn sẽ sử dụng MongoDB Atlas để tìm kiếm vector, giúp tăng hiệu suất và độ chính xác của các câu trả lời liên quan đến sản phẩm, blog và coupon.

## Lưu ý quan trọng

- Gemini Embeddings có kích thước 768 chiều
- MongoDB Atlas tiêu chuẩn hỗ trợ tối đa 2.000 vector trên thiết lập Free tier
- Hệ thống được thiết kế để fallback về tính toán similarity thông thường nếu Vector Search không khả dụng
- Mỗi loại dữ liệu (sản phẩm, blog, coupon) sẽ được lưu trong collection riêng biệt để dễ quản lý và tối ưu hiệu suất

## Gỡ lỗi phổ biến

1. Nếu thấy thông báo lỗi kết nối đến Atlas, kiểm tra lại connection string và cài đặt Network Access
2. Nếu vector search không hoạt động, kiểm tra phiên bản MongoDB của bạn (cần ≥ 6.0) và xác nhận biến HAS_VECTOR_SEARCH=true
3. Nếu embedding không được tạo, kiểm tra API key của Gemini
4. Đảm bảo rằng mỗi collection đều có vector index được tạo đúng cách
