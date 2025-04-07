import React, { memo } from "react";
import icons from "utils/icons";
const {
  MdEmail,
  FaPhoneAlt,
  GiPositionMarker,
  FaFacebook,
  FaFacebookMessenger,
  FaTwitter,
  FaInstagramSquare,
  FaGoogle,
  FaDiscord,
} = icons;
const Footer = () => {
  return (
    <div className="w-full">
      {/* Newsletter Section with Gradient Background */}
      <div className="py-8 bg-gradient-to-r from-red-900 to-pink-900 w-full">
        <div className="w-main mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col text-center md:text-left mb-4 md:mb-0">
              <span className="text-2xl font-bold text-white tracking-wide">
                ĐĂNG KÍ NHẬN TIN
              </span>
              <span className="text-sm text-gray-200 mt-1">
                Đăng kí ngay và nhận bản tin tuần hàng tuần với các ưu đãi độc quyền
              </span>
            </div>
            <div className="flex w-full md:w-1/2 relative">
              <input
                className="p-4 rounded-l-full w-full bg-white bg-opacity-90 outline-none text-gray-800 h-[55px]
                placeholder:text-sm placeholder:text-gray-600 placeholder:italic shadow-inner"
                type="text"
                placeholder="Địa chỉ email của bạn"
              />
              <button className="h-[55px] px-6 bg-gray-900 hover:bg-black transition-colors duration-300 rounded-r-full flex items-center justify-center text-white cursor-pointer">
                <MdEmail size={30} className="mr-2" />
                <span className="hidden md:inline text-sm font-medium">Đăng kí</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Footer Content */}
      <div className="py-12 w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="w-main mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Us Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold border-l-4 border-red-500 pl-3 mb-5">
              ABOUT US
            </h3>
            <p className="flex items-center gap-3 text-gray-300 hover:text-white transition duration-300">
              <GiPositionMarker className="text-red-500 flex-shrink-0" />
              <span><strong>Địa chỉ:</strong> Đà Nẵng, Việt Nam</span>
            </p>
            <p className="flex items-center gap-3 text-gray-300 hover:text-white transition duration-300">
              <FaPhoneAlt className="text-red-500 flex-shrink-0" />
              <span><strong>Điện thoại:</strong> (+84) 000 8386 008</span>
            </p>
            <p className="flex items-center gap-3 text-gray-300 hover:text-white transition duration-300">
              <MdEmail className="text-red-500 flex-shrink-0" />
              <span><strong>Email:</strong> duonganhtu@gmail.com</span>
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center mt-4 gap-3 flex-wrap">
              <a
                href="/"
                className="p-2.5 bg-gray-800 rounded-lg hover:bg-red-500 transition-all duration-300 hover:scale-110"
              >
                <FaFacebook className="text-white text-lg" />
              </a>
              <a
                href="/"
                className="p-2.5 bg-gray-800 rounded-lg hover:bg-red-500 transition-all duration-300 hover:scale-110"
              >
                <FaTwitter className="text-white text-lg" />
              </a>
              <a
                href="/"
                className="p-2.5 bg-gray-800 rounded-lg hover:bg-red-500 transition-all duration-300 hover:scale-110"
              >
                <FaInstagramSquare className="text-white text-lg" />
              </a>
              <a
                href="/"
                className="p-2.5 bg-gray-800 rounded-lg hover:bg-red-500 transition-all duration-300 hover:scale-110"
              >
                <FaGoogle className="text-white text-lg" />
              </a>
              <a
                href="/"
                className="p-2.5 bg-gray-800 rounded-lg hover:bg-red-500 transition-all duration-300 hover:scale-110"
              >
                <FaDiscord className="text-white text-lg" />
              </a>
            </div>
          </div>
          
          {/* Information Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold border-l-4 border-red-500 pl-3 mb-5">
              THÔNG TIN
            </h3>
            <a href="/" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center">
              <span className="border-b border-transparent hover:border-red-500 pb-1">Chính sách bảo mật</span>
            </a>
            <a href="/" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center">
              <span className="border-b border-transparent hover:border-red-500 pb-1">Điều khoản dịch vụ</span>
            </a>
            <a href="/" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center">
              <span className="border-b border-transparent hover:border-red-500 pb-1">Địa chỉ cửa hàng</span>
            </a>
            <a href="/" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center">
              <span className="border-b border-transparent hover:border-red-500 pb-1">Tuyển dụng</span>
            </a>
            <a href="/" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center">
              <span className="border-b border-transparent hover:border-red-500 pb-1">Liên hệ</span>
            </a>
          </div>
          
          {/* Who We Are Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold border-l-4 border-red-500 pl-3 mb-5">
              CHÚNG TÔI LÀ AI
            </h3>
            <a href="/" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center">
              <span className="border-b border-transparent hover:border-red-500 pb-1">Hỗ trợ</span>
            </a>
            <a href="/" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center">
              <span className="border-b border-transparent hover:border-red-500 pb-1">Miễn phí vận chuyển</span>
            </a>
            <a href="/" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center">
              <span className="border-b border-transparent hover:border-red-500 pb-1">Câu hỏi thường gặp</span>
            </a>
            <a href="/" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center">
              <span className="border-b border-transparent hover:border-red-500 pb-1">Trả hàng và đổi trả</span>
            </a>
            <a href="/" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center">
              <span className="border-b border-transparent hover:border-red-500 pb-1">Đánh giá khách hàng</span>
            </a>
          </div>
          
          {/* Services Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold border-l-4 border-red-500 pl-3 mb-5">
              DỊCH VỤ KHÁC
            </h3>
            <a href="/" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center">
              <span className="border-b border-transparent hover:border-red-500 pb-1">Khách hàng doanh nghiệp (B2B)</span>
            </a>
            <a href="/" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center">
              <span className="border-b border-transparent hover:border-red-500 pb-1">Các ưu đãi thanh toán</span>
            </a>
            <a href="/" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center">
              <span className="border-b border-transparent hover:border-red-500 pb-1">Các quy định hoạt động</span>
            </a>
            <a href="/" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center">
              <span className="border-b border-transparent hover:border-red-500 pb-1">Tuyển dụng</span>
            </a>
            <a href="/" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center">
              <span className="border-b border-transparent hover:border-red-500 pb-1">Chính sách bảo hành</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Footer Bottom */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-6">
        <div className="w-main mx-auto px-4 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center mb-4">
            <img
              src="https://xstore.b-cdn.net/elementor2/marseille04/wp-content/uploads/sites/2/elementor/thumbs/Icons-123-pzks3go5g30b2zz95xno9hgdw0h3o8xu97fbaqhtb6.png"
              alt="Payment methods"
              className="h-8"
            />
          </div>
          <div className="text-gray-400 text-center text-sm">
            <p>Hy vọng khách hàng có trải nghiệm dịch vụ tốt nhất tại Marseille</p>
            <p className="mt-1">Copyright © 2025 ATKING theme. Created by ATKING</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Footer);