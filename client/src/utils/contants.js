import path from "./path";
import icons from "./icons";
import { FiCheck, FiX, FiTruck, FiClock } from "react-icons/fi";

export const navigation = [
  {
    id: 1,
    value: "TRANG CHỦ",
    path: `/${path.HOME}`,
  },
  {
    id: 2,
    value: "SẢN PHẨM",
    path: `/${path.PRODUCTS}`,
  },
  {
    id: 3,
    value: "BLOGS",
    path: `/${path.BLOGS}`,
  },
  {
    id: 4,
    value: "DỊCH VỤ",
    path: `/${path.OUR_SERVICES}`,
  },
  {
    id: 5,
    value: "HỎI ĐÁP",
    path: `/${path.FAQ}`,
  },
];

const { FaTruck, FaGift, FaReply, FaShieldHalved, FaTty } = icons;
export const productExtraInformation = [
  {
    id: 1,
    title: "BẢO HÀNH",
    sub: "Chính hãng",
    icon: <FaShieldHalved />,
  },
  {
    id: 2,
    title: "GIAO HÀNG",
    sub: "Miễn phí",
    icon: <FaTruck />,
  },
  {
    id: 3,
    title: "QUÀ TẶNG",
    sub: "Quà tặng đặc biệt",
    icon: <FaGift />,
  },
  {
    id: 4,
    title: "TRẢ HÀNG",
    sub: "Trong vòng 7 ngày",
    icon: <FaReply />,
  },
  {
    id: 5,
    title: "TƯ VẤN",
    sub: "24/7/365",
    icon: <FaTty />,
  },
];

export const productInfoTabs = [
  {
    id: 1,
    name: "Đánh giá",
  },
  {
    id: 2,
    name: "Mô tả",
  }
];
export const colors = [
  "đen",
  "nâu",
  "xám",
  "trắng",
  "hồng",
  "vàng",
  "cam",
  "tím",
  "xanh lá cây",
  "xanh dương",
];

export const sorts = [
  {
    id: 1,
    value: "-sold",
    text: "Bán chạy nhất",
  },
  {
    id: 2,
    value: "title",
    text: "Theo thứ tự A->Z",
  },
  {
    id: 3,
    value: "-title",
    text: "Theo thứ tự Z->A",
  },
  {
    id: 4,
    value: "-price",
    text: "Giá cao đến thấp",
  },
  {
    id: 5,
    value: "price",
    text: "Giá thấp đến cao",
  },
  {
    id: 6,
    value: "-createAt",
    text: "Ngày mới đến ngày cũ",
  },
  {
    id: 7,
    value: "createAt",
    text: "Ngày cũ đến ngày mới",
  },
];

export const ratingOptions = [
  {
    id: 1,
    text: "Rất tệ",
  },
  {
    id: 2,
    text: "Tệ",
  },
  {
    id: 3,
    text: "Bình thường",
  },
  {
    id: 4,
    text: "Tốt",
  },
  {
    id: 5,
    text: "Rất tốt",
  },
];

const { RxDashboard, RiGroupLine, RiProductHuntLine, RiBillLine, FaPercentage, MdEmail, RiRobot2Line } = icons;
export const adminSidebar = [
  {
    id: 1,
    type: "SINGLE",
    text: "Bảng điều khiển",
    path: `/${path.ADMIN}/${path.DASHBOARD}`,
    icon: <RxDashboard />,
  },
  {
    id: 2,
    type: "SINGLE",
    text: "Quản lý người dùng",
    path: `/${path.ADMIN}/${path.MANAGE_USER}`,
    icon: <RiGroupLine />,
  },
  {
    id: 3,
    type: "PARENT",
    text: "Sản phẩm",
    icon: <RiProductHuntLine />,
    submenu: [
      {
        text: "Quản lý sản phẩm",
        path: `/${path.ADMIN}/${path.MANAGE_PRODUCT}`,
      },
      {
        text: "Tạo mới sản phẩm",
        path: `/${path.ADMIN}/${path.CREATE_PRODUCT}`,
      },
      {
        text: "Quản lý embeddings",
        path: `/${path.ADMIN}/embeddings`,
      },
    ],
  },
  {
    id: 4,
    type: "SINGLE",
    text: "Quản lý đơn hàng",
    path: `/${path.ADMIN}/${path.MANAGE_ORDER}`,
    icon: <RiBillLine />,
  },
  {
    id: 5,
    type: "SINGLE",
    text: "Mã khuyến mãi",
    path: `/${path.ADMIN}/${path.MANAGE_COUPON}`,
    icon: <FaPercentage />,
  },
  {
    id: 6,
    type: "SINGLE",
    text: "Quản lý Blog",
    path: `/${path.ADMIN}/${path.MANAGE_BLOG}`,
    icon: <MdEmail />,
  },
];

const { FaHeartCircleCheck, RiAccountCircleFill, RiShoppingCartFill, RiBillFill } = icons;
export const memberSidebar = [
  {
    id: 1,
    type: "SINGLE",
    text: "Tài khoản",
    path: `/${path.MEMBER}/${path.PERSONAL}`,
    icon: <RiAccountCircleFill />,
  },
  {
    id: 2,
    type: "SINGLE",
    text: "Giỏ hàng",
    path: `/${path.MEMBER}/${path.MY_CART}`,
    icon: <RiShoppingCartFill />,
  },
  {
    id: 3,
    type: "SINGLE",
    text: "Danh sách yêu thích",
    path: `/${path.MEMBER}/${path.WISHLIST}`,
    icon: <FaHeartCircleCheck />,
  },
  {
    id: 4,
    type: "SINGLE",
    text: "Đơn hàng",
    path: `/${path.MEMBER}/${path.MY_ORDER}`,
    icon: <RiBillFill />,
  },
];

export const roles = [
  {
    code: 2010,
    value: "Admin"
  },
  {
    code: 2607,
    value: "User"
  }
]

export const blockStatus = [
  {
    code: true,
    value: "Đã khóa"
  },
  {
    code: false,
    value: "Hoạt động"
  }
]

export const statusConfig = {
  "Đã hủy": {
    color: "bg-red-500",
    icon: <FiX className="mr-1" />,
    lightBg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700"
  },
  "Đang xử lý": {
    color: "bg-amber-500",
    icon: <FiClock className="mr-1" />,
    lightBg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700"
  },
  "Đã xác nhận": {
    color: "bg-blue-500",
    icon: <FiTruck className="mr-1" />,
    lightBg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700"
  },
  "Hoàn thành": {
    color: "bg-green-500", 
    icon: <FiCheck className="mr-1" />,
    lightBg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700"
  }
};

// Brand logos for the homepage slider
export const brandLogos = [
  { id: 1, name: "Asus", logo: "https://en.accessoires-asus.com/template/smartphoneV3/images/pba_home_black.png", color: "#f25022" },
  { id: 2, name: "Dell", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dell_Logo.svg/1200px-Dell_Logo.svg.png", color: "#415fff" },
  { id: 3, name: "Acer", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Acer_2011.svg/2560px-Acer_2011.svg.png", color: "#6aad29" },
  { id: 4, name: "Lenovo", logo: "https://logos-world.net/wp-content/uploads/2022/07/Lenovo-Logo.png", color: "#a50034" },
  { id: 5, name: "LG", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/LG_symbol.svg/640px-LG_symbol.svg.png", color: "#a50034" },
  { id: 6, name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/512px-Samsung_Logo.svg.png", color: "#1428a0" },
  { id: 7, name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/488px-Apple_logo_black.svg.png", color: "#555555" },
  { id: 8, name: "Xiaomi", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Xiaomi_logo_%282021-%29.svg/512px-Xiaomi_logo_%282021-%29.svg.png", color: "#ff6700" },
  { id: 9, name: "Huawei", logo: "https://hrc.com.vn/wp-content/uploads/2025/02/Huawei-Logo.png", color: "#a50034" },
  { id: 10, name: "Oppo", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/OPPO_LOGO_2019.svg/2560px-OPPO_LOGO_2019.svg.png", color: "#6aad29" },
];

// Popular blog posts for Blog page
export const popularPosts = [
  {
    id: 1,
    title: 'Top 10 Điện thoại thông minh năm 2025',
    date: 'Ngày 10 tháng 4 năm 2025',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 2,
    title: 'Hướng dẫn hoàn hảo cho bàn phím cơ',
    date: 'Ngày 28 tháng 3 năm 2025',
    image: 'https://images.unsplash.com/photo-1618384887929-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 3,
    title: 'Cách AI đang thay đổi ngành công nghệ',
    date: 'Ngày 15 tháng 3 năm 2025',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 4,
    title: 'Tai nghe giá rẻ tốt nhất năm 2025',
    date: 'Ngày 30 tháng 2 năm 2025',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
  }
];

// Blog tags
export const blogTags = [
  'Smartphones', 'Laptops', 'Wearables', 'Gaming', 'AI',
  'IoT', 'Headphones', 'Cameras', 'Speakers', 'Accessories',
  'Apple', 'Samsung', 'Reviews', 'Tips'
];

// Blog categories
export const blogCategories = [
  { name: 'Technology', count: 15 },
  { name: 'Buying Guide', count: 8 },
  { name: 'Gadgets', count: 12 },
  { name: 'Smart Home', count: 7 },
  { name: 'Security', count: 5 },
  { name: 'Reviews', count: 20 },
  { name: 'News', count: 18 }
];

// Product categories for category grid
export const productCategories = [
  {
    title: "Smartphone",
    slug: "smartphone",
    image: "https://cdn2.fptshop.com.vn/unsafe/360x0/filters:format(webp):quality(75)/phone_cate_c6a412f60a.png"
  },
  {
    title: "Laptop",
    slug: "laptop",
    image: "https://cdn2.fptshop.com.vn/unsafe/180x0/filters:format(webp):quality(75)/laptop_thumb_2_4df0fab60f.png"
  },
  {
    title: "Television",
    slug: "television",
    image: "https://cdn2.fptshop.com.vn/unsafe/180x0/filters:format(webp):quality(75)/tivi_thumb_2_fc9b0f8bde.png"
  },
  {
    title: "Tablet",
    slug: "tablet",
    image: "https://cdn2.fptshop.com.vn/unsafe/180x0/filters:format(webp):quality(75)/may_tinh_bang_cate_thumb_00e3b3eefa.png"
  },
  {
    title: "Accessories",
    slug: "accessories",
    image: "https://cdn2.fptshop.com.vn/unsafe/180x0/filters:format(webp):quality(75)/phu_kien_thum_2_21c419aa09.png"
  },
  {
    title: "Printer",
    slug: "printer",
    image: "https://cdn2.fptshop.com.vn/unsafe/180x0/filters:format(webp):quality(75)/May_in_59d1dcd0dc.png"
  },
  {
    title: "Camera",
    slug: "camera",
    image: "https://cdn2.fptshop.com.vn/unsafe/64x0/filters:format(webp):quality(75)/camera_hanh_dongcate_thumb_da05dfe989.png"
  },
  {
    title: "Speaker",
    slug: "speaker",
    image: "https://cdn2.fptshop.com.vn/unsafe/360x0/filters:format(webp):quality(75)/2024_1_20_638413445872509479_loa-bluetooth-icore-m32-dd.jpg"
  }
];