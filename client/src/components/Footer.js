import React, { memo } from "react";
import icons from "../utils/icons";
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
    <div className="w-full ">
      <div className="h-[103px] bg-main w-full flex items-center justify-center">
        <div className="w-main flex items-center justify-between">
          <div className="flex flex-col flex-1">
            <span className="text-[22px] text-gray-100">
              SIGN UP TO NEWSLETTER
            </span>
            <small className="text-[15px] text-gray-400">
              Subscribe now and receive weekly newsletter
            </small>
          </div>
          <input
            className="p-4 pr-0 rounded-l-full w-full flex-1 bg-[#f04646] outline-none text-gray-100 h-[55px]
          placeholder:text-sm placeholder:text-gray-200 placeholder:italic placeholder:opacity-50"
            type="text"
            placeholder="Email address"
          />
          <div className="h-[55px] w-[55px] bg-[#f04646] rounded-r-full flex items-center justify-center text-white">
            <MdEmail size={16} />
          </div>
        </div>
      </div>
      <div className="h-[407px] w-full bg-[#161616] flex items-center justify-center text-white text-[13pX]">
        <div className="w-main flex items-center gap-x-16">
          <div className="flex-22 flex flex-col gap-2">
            <h3 className="mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]">
              ABOUT US
            </h3>
            <p className="flex items-center gap-2">
              <GiPositionMarker className="text-red-500" />
              <strong>Address:</strong>
              <span className="opacity-50">Da Nang, Viet Nam</span>
            </p>
            <p className="flex items-center gap-2">
              <FaPhoneAlt className="text-red-500" />
              <strong>Phone:</strong>
              <span className="opacity-50">(+84) 000 8386 008</span>
            </p>
            <p className="flex items-center gap-2">
              <MdEmail className="text-red-500" />
              <strong>Mail:</strong>
              <span className="opacity-50">duonganhtu@gmail.com</span>
            </p>
            {/* Social Icons */}
            <div className="flex items-center mt-4 space-x-3">
              <a href="/" className="p-3 bg-gray-800 rounded-lg hover:bg-red-500 transition">
                <FaFacebook className="text-white text-lg" />
              </a>
              <a href="/" className="p-3 bg-gray-800 rounded-lg hover:bg-red-500 transition">
                <FaTwitter className="text-white text-lg" />
              </a>
              <a href="/" className="p-3 bg-gray-800 rounded-lg hover:bg-red-500 transition">
                <FaFacebookMessenger className="text-white text-lg" />
              </a>
              <a href="/" className="p-3 bg-gray-800 rounded-lg hover:bg-red-500 transition">
                <FaInstagramSquare className="text-white text-lg" />
              </a>
              <a href="/" className="p-3 bg-gray-800 rounded-lg hover:bg-red-500 transition">
                <FaGoogle className="text-white text-lg" />
              </a>
              <a href="/" className="p-3 bg-gray-800 rounded-lg hover:bg-red-500 transition">
                <FaDiscord className="text-white text-lg" />
              </a>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <h3 className="mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]">
              INFORMATION
            </h3>
            <span className="opacity-50">Typography</span>
            <span className="opacity-50">Gallery</span>
            <span className="opacity-50">Store Location</span>
            <span className="opacity-50">Today's Deals</span>
            <span className="opacity-50">Contact</span>
          </div>
          <div className="flex-1">
            <div className="flex-1 flex flex-col gap-2">
              <h3 className="mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]">
                WHO WE ARE
              </h3>
              <span className="opacity-50">Help</span>
              <span className="opacity-50">Free Shipping</span>
              <span className="opacity-50">FAQs</span>
              <span className="opacity-50">Return & Exchange</span>
              <span className="opacity-50">Testimonials</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <h3 className="mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]">
              SERVICES OTHER
            </h3>
            <span className="opacity-50">Business customers (B2B)</span>
            <span className="opacity-50">Payment incentives</span>
            <span className="opacity-50">Operating regulations</span>
            <span className="opacity-50">Recruitment</span>
            <span className="opacity-50">Warranty policy</span>
          </div>
        </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
            <p style={{ margin: 0 }}>© 2025, Digital World 2 Powered by Shopify</p>
            <div style={{ display: "flex", gap: "15px" }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" style={{ height: "24px" }} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MasterCard" style={{ height: "24px" }} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo_%282018%29.svg" alt="American Express" style={{ height: "24px" }} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style={{ height: "24px" }} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0c/Discover_Card_logo.svg" alt="Discover" style={{ height: "24px" }} />

        </div>
      </div>
    </div>
  );
};

export default memo(Footer);
