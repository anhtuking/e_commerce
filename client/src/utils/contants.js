import path from "./path";
import icons from "./icons";
import { FiCheck, FiX, FiTruck, FiClock } from "react-icons/fi";

export const navigation = [
  {
    id: 1,
    value: "HOME",
    path: `/${path.HOME}`,
  },
  {
    id: 2,
    value: "PRODUCTS",
    path: `/${path.PRODUCTS}`,
  },
  {
    id: 3,
    value: "BLOGS",
    path: `/${path.BLOGS}`,
  },
  {
    id: 4,
    value: "OUR SERVICES",
    path: `/${path.OUR_SERVICES}`,
  },
  {
    id: 5,
    value: "FAQs",
    path: `/${path.FAQ}`,
  },
];

const { FaTruck, FaGift, FaReply, FaShieldHalved, FaTty } = icons;
export const productExtraInformation = [
  {
    id: 1,
    title: "Guarantee",
    sub: "Quality checked",
    icon: <FaShieldHalved />,
  },
  {
    id: 2,
    title: "Free Shipping",
    sub: "Free on all products",
    icon: <FaTruck />,
  },
  {
    id: 3,
    title: "Special Gift Cards",
    sub: "Special gift cards",
    icon: <FaGift />,
  },
  {
    id: 4,
    title: "Free Return",
    sub: "Within 7 days",
    icon: <FaReply />,
  },
  {
    id: 5,
    title: "Consultancy",
    sub: "Lifetime 24/7/356",
    icon: <FaTty />,
  },
];

export const productInfoTabs = [
  {
    id: 1,
    name: "DESCRIPTION",
    content: `Technology: GSM / HSPA / LTE
      Dimensions: 144.6 x 69.2 x 7.3 mm
      Weight: 129 g
      Display: IPS LCD 5.15 inches
      Resolution: 1080 x 1920
      OS: Android OS, v6.0 (Marshmallow)
      Chipset: Snapdragon 820
      CPU: Quad-core
      Internal: 32GB/64GB/128GB
      Camera: 16 MP, f/2.0 - 4 MP, f/2.0`,
  },
  {
    id: 2,
    name: "WARRANTY",
    content: `Warranty Information
      LIMITED WARRANTIES
      Limited Warranties are non-transferable. The following Limited Warranties are given to the original retail purchaser of the following Ashley Furniture Industries, Inc.Products:

      Frames Used In Upholstered and Leather Products
      Limited Lifetime Warranty
      A Limited Lifetime Warranty applies to all frames used in sofas, couches, love seats, upholstered chairs, ottomans, sectionals, and sleepers. Ashley Furniture Industries,Inc. warrants these components to you, the original retail purchaser, to be free from material manufacturing defects.`,
  },
  {
    id: 3,
    name: "DELIVERY",
    content: `Purchasing & Delivery
      Before you make your purchase, it's helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.
      Picking up at the store
      Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser's responsibility to make sure the correct items are picked up and in good condition.`,
  },
  {
    id: 4,
    name: "PAYMENT",
    content: `Purchasing & Delivery
      Before you make your purchase, it's helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.
      Picking up at the store
      Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser's responsibility to make sure the correct items are picked up and in good condition.`,
  },
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

const { RxDashboard, RiGroupLine, RiProductHuntLine, RiBillLine, FaPercentage, MdEmail } = icons;
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
    value: "Blocked"
  },
  {
    code: false,
    value: "Active"
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