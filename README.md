# E-Commerce Platform

Dự án E-Commerce được phát triển như một website thương mại điện tử toàn diện với đầy đủ tính năng cho người dùng, thành viên và quản trị viên.

## Tổng quan

Dự án bao gồm:
- **Client**: Frontend phát triển với React 19, Redux Toolkit, Tailwind CSS
- **Server**: RESTful API xây dựng với Express/Node.js
- **Database**: MongoDB

## Công nghệ sử dụng

### Frontend
- React 19
- Redux & Redux Toolkit
- Tailwind CSS
- React Router v7
- Axios
- React Hook Form
- Formik & Yup
- Ant Design & Material UI
- Chart.js
- React Slick (carousel)
- Sweet Alert 2
- React Toastify

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- Bcrypt (mã hóa password)
- Cloudinary (lưu trữ hình ảnh)
- Nodemailer (gửi email)
- Multer (upload file)
- VNPAY (thanh toán)

### Chatbot
- Gemini AI Integration
- Retrieval-Augmented Generation (RAG)

## Tính năng

### Người dùng
- Đăng ký, đăng nhập, quên mật khẩu
- Xem và tìm kiếm sản phẩm
- Lọc sản phẩm theo nhiều tiêu chí
- Giỏ hàng và thanh toán (VNPAY)
- Xem blog và bài viết
- Chat với trợ lý AI

### Thành viên
- Quản lý thông tin cá nhân
- Theo dõi đơn hàng
- Lịch sử mua hàng
- Đánh giá sản phẩm

### Quản trị viên
- Quản lý sản phẩm, danh mục
- Quản lý người dùng
- Quản lý đơn hàng
- Quản lý blog, danh mục blog
- Quản lý mã giảm giá (coupon)
- Thống kê doanh thu
- Quản lý thương hiệu

## Cài đặt và chạy dự án

### Yêu cầu
- Node.js
- npm hoặc yarn
- MongoDB
- Tài khoản Cloudinary (lưu trữ ảnh)
- Tài khoản VNPAY (cho thanh toán)

### Cài đặt

1. Clone dự án:
```
git clone <repository-url>
```

2. Cài đặt dependencies cho client:
```
cd client
npm install
```

3. Cài đặt dependencies cho server:
```
cd server
npm install
```

4. Tạo file .env trong thư mục server với các biến môi trường:
```
PORT=8888
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
CLIENT_URL=http://localhost:3000
CLOUDINARY_NAME=<your_cloudinary_name>
CLOUDINARY_KEY=<your_cloudinary_key>
CLOUDINARY_SECRET=<your_cloudinary_secret>
EMAIL_APP_PASSWORD=<your_email_app_password>
EMAIL_NAME=<your_email>
VNPAY_TMN_CODE=<your_vnpay_tmn_code>
VNPAY_HASH_SECRET=<your_vnpay_hash_secret>
VNPAY_URL=<vnpay_payment_url>
VNPAY_RETURN_URL=<your_return_url>
```


Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng trong trình duyệt.

## Cấu trúc dự án

### Client
```
client/
├── public/          # Static files
├── src/
│   ├── api/         # API calls
│   ├── assets/      # Images, fonts
│   ├── components/  # Reusable components
│   ├── gemini/      # AI integration
│   ├── hooks/       # Custom hooks
│   ├── pages/       # Page components
│   │   ├── admin/   # Admin pages
│   │   ├── member/  # Member pages
│   │   └── publics/ # Public pages
│   ├── store/       # Redux store
│   ├── utils/       # Utility functions
│   ├── App.js       # Main component
│   └── index.js     # Entry point
└── tailwind.config.js # Tailwind configuration
```

### Server
```
server/
├── config/         # Database configuration
├── controllers/    # Request handlers
├── middlewares/    # Express middlewares
├── models/         # MongoDB schemas
├── routes/         # API routes
├── ultils/         # Utility functions
└── server.js       # Entry point
```

## License

MIT

## Hướng dẫn cho người nhận dự án

Nếu bạn vừa nhận được dự án này và muốn chạy nó, hãy làm theo các bước sau:

### 1. Cài đặt các phần mềm cần thiết
- Cài đặt Node.js từ [nodejs.org](https://nodejs.org/) (phiên bản 18 trở lên)
- Cài đặt MongoDB từ [mongodb.com](https://www.mongodb.com/try/download/community) hoặc sử dụng MongoDB Atlas
- Cài đặt Git (nếu bạn nhận dự án qua repository)

### 2. Lấy mã nguồn
- Giải nén file nén (nếu dự án được gửi dưới dạng file nén)
- Hoặc clone repository (nếu dự án được chia sẻ qua Git)

### 3. Thiết lập biến môi trường
- Tạo file `.env` trong thư mục server theo mẫu trong phần "Cài đặt" ở trên
- Điền các thông tin cần thiết (MongoDB URI, Cloudinary credentials, JWT secret, etc.)

### 4. Cài đặt dependencies
Vì thư mục node_modules đã bị xóa để giảm dung lượng, bạn cần cài đặt lại:

```
# Cài đặt dependencies cho client
cd client
npm install

# Cài đặt dependencies cho server
cd ../server
npm install
```

### 5. Chạy dự án

```
# Terminal 1: Chạy server
cd server
npm run dev

# Terminal 2: Chạy client
cd client
npm start
```

Mở trình duyệt và truy cập [http://localhost:3000](http://localhost:3000) để sử dụng ứng dụng.

### Xử lý lỗi phổ biến

1. Nếu gặp lỗi liên quan đến dependencies, thử xóa package-lock.json và cài đặt lại:
```
rm package-lock.json (hoặc del package-lock.json trên Windows)
npm install
```

2. Nếu không kết nối được với MongoDB, kiểm tra lại MongoDB URI trong file .env và đảm bảo MongoDB đang chạy

3. Nếu gặp lỗi với các API bên ngoài (Cloudinary, VNPAY), đảm bảo các thông tin xác thực trong file .env là chính xác

## Chi tiết về Chatbot

### Tổng quan
Chatbot của dự án được xây dựng dựa trên công nghệ Gemini AI của Google, kết hợp với kỹ thuật Retrieval-Augmented Generation (RAG) để cung cấp trải nghiệm tương tác thông minh và đáp ứng nhu cầu của người dùng.

### Tính năng chính
- **Trợ lý thông minh**: Hỗ trợ người dùng tìm kiếm sản phẩm, trả lời câu hỏi về đơn hàng, chính sách
- **Tư vấn sản phẩm**: Gợi ý sản phẩm phù hợp dựa trên yêu cầu của khách hàng
- **Hỗ trợ đa ngôn ngữ**: Hỗ trợ tiếng Việt và tiếng Anh
- **Phản hồi theo ngữ cảnh**: Nhớ nội dung cuộc trò chuyện trước đó để đưa ra phản hồi phù hợp
- **Truy xuất thông tin động**: Sử dụng RAG để truy xuất thông tin cập nhật từ cơ sở dữ liệu

### Công nghệ sử dụng
- **Gemini API**: Sử dụng mô hình ngôn ngữ lớn của Google
- **Retrieval-Augmented Generation**: Tăng cường độ chính xác bằng cách truy xuất thông tin từ cơ sở dữ liệu sản phẩm
- **Vector Database**: Lưu trữ và tìm kiếm thông tin sản phẩm hiệu quả
- **Context Management**: Quản lý ngữ cảnh cuộc trò chuyện

### Cài đặt và cấu hình RAG
1. **Cấu hình .env file**:
   - Đăng ký Gemini API key tại [Google AI Studio](https://ai.google.dev/)
   - Thêm các biến môi trường sau vào file `.env` trong thư mục server:
   ```
   # API Key cho Google Generative AI / Gemini
   GOOGLE_GEMINI_API_KEY=your_gemini_api_key

   # Cấu hình MongoDB local
   MONGODB_URI=mongodb://localhost:27017/your_database_name

   # Tắt Vector Search nếu dùng MongoDB Compass local
   HAS_VECTOR_SEARCH=false
   ```

2. **Thiết lập MongoDB**:
   - **Cài đặt**: MongoDB Community Server và MongoDB Compass
   - **Tạo Collections**: Đảm bảo có các collections `products`, `blogs`, `embeddings`
   - **Lựa chọn**: Có thể sử dụng MongoDB local hoặc Atlas

3. **Tạo Embeddings**:
   - Chạy server: `npm run dev` trong thư mục server
   - Sử dụng API để tạo embeddings:
     - `GET /api/embedding/generate-all` - Tạo embeddings cho sản phẩm
     - `GET /api/embedding/generate-all-blogs` - Tạo embeddings cho blogs

### Hoạt động của RAG
1. **Với MongoDB Compass (local)**:
   - Sử dụng tính toán cosine similarity thủ công trong JavaScript
   - Phù hợp với tập dữ liệu nhỏ và vừa
   - Không yêu cầu dịch vụ đám mây

2. **Với MongoDB Atlas**:
   - Sử dụng Vector Search tích hợp sẵn
   - Hiệu suất cao hơn với tập dữ liệu lớn
   - Cung cấp công cụ theo dõi hiệu suất

### Kiểm tra và tối ưu hóa
- **Kiểm tra**: Đặt câu hỏi liên quan đến sản phẩm hoặc blog để xác nhận hoạt động
- **Tối ưu hiệu suất**: Thêm index, thực hiện batching khi tạo embeddings
- **Tự động hóa**: Tích hợp tạo embeddings tự động khi có dữ liệu mới

### Hướng dẫn chi tiết
Tham khảo file `RAG_SETUP.md` để biết thêm chi tiết về thiết lập và tối ưu hóa RAG.
