import icons from "./icons";
const { MdOutlineStar, MdOutlineStarBorder } = icons;

export const createSlug = (string) => {
  if (!string) return ""; // Tránh lỗi nếu string là undefined
  return string
    .toLowerCase() //chuyển thành chữ thường
    .normalize("NFD") //bỏ dấu
    .replace(/[\u0300-\u036f]/g, "")
    .split(" ") //chuyển thành mảng có khoảng cáchcách
    .join("-"); //join mảng lại theo dấu -
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export const renderStarFromNumber = (number, size) => {
  // 4 => [1,1,1,1,0]
  // 3 => [1,1,1,0,0]
  if (!Number(number)) return;

  const stars = [];
  number = Math.round(number)
  
  for (let i = 0; i < +number; i++)
    stars.push(<MdOutlineStar color="orange" size={size || 16} />);
  for (let i = 5; i > +number; i--)
    stars.push(<MdOutlineStarBorder color="orange" size={size || 16} />);

  return stars;
};

export function secondsToHms(d) {
  d = Number(d) / 1000; // d đang là mili seconds nên sẽ chia cho 1000 để ra secondsseconds
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);
  return { h, m, s };
}

export const validate = (payload, setInvalidFields) => {
  let invalids = 0;
  const formatPayload = Object.entries(payload);
  for (let arr of formatPayload) {
    if (arr[1].trim() === "") {
      invalids++;
      setInvalidFields((prev) => [
        ...prev,
        { name: arr[0], mes: "Require this field!" },
      ]);
    }
  }
  for (let arr of formatPayload) {
    switch (arr[0]) {
      case "email":
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!arr[1].match(regex)) {
          invalids++;
          setInvalidFields((prev) => [
            ...prev,
            { name: arr[0], mes: "Email invalid." },
          ]);
        }
        break;
      case "password":
        if (arr[1].length < 6) {
          invalids++;
          setInvalidFields((prev) => [
            ...prev,
            { name: arr[0], mes: "Password minimum 6 characters" },
          ]);
        }
        break;
      case "firstname":
      case "lastname":
        const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/;
        if (!arr[1].match(nameRegex)) {
          invalids++;
          setInvalidFields((prev) => [
            ...prev,
            { name: arr[0], mes: "No special characters allowed" },
          ]);
        }
        break;
      case "mobile":
        const mobileRegex = /^[0-9]+$/;
        if (!arr[1].match(mobileRegex)) {
          invalids++;
          setInvalidFields((prev) => [
            ...prev,
            { name: arr[0], mes: "Only numbers allowed" },
          ]);
        }
        break;
      default:
        break;
    }
  }
  return invalids;
};

export const formatMoney = number => Math.round( number / 1000 )* 1000

export const generateRange = (start, end) => { 
  const length = end + 1 - start 
  return Array.from({length}, (_, index) => start + index)
}

export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export const addToCartUtil = (product, quantity = 1, variant = null) => {
  // Xử lý dữ liệu khi có biến thể
  let color = product?.color || 'Default';
  let price = product?.price;
  let thumb = product?.thumb;
  let title = product?.title;

  // Nếu có biến thể được chọn
  if (variant) {
    color = variant.color || color;
    price = variant.price || price;
    thumb = variant.thumb || thumb;
    title = variant.title || title;
  }

  // Trả về đối tượng dữ liệu cho API
  return {
    pid: product?._id,
    color,
    quantity,
    price,
    thumbnail: thumb,
    title
  };
};

export const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getConfig = () => {
  let token = localStorage.getItem('accessToken');
  // Nếu token có dấu ngoặc kép ở đầu và cuối, loại bỏ chúng
  if (token && token.startsWith('"') && token.endsWith('"')) {
    token = token.substring(1, token.length - 1);
  }
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  };
};


export const formatOrderStatus = (status) => {
  const mapStatus = {
    Processing: 'Đang xử lý',
    Confirmed: 'Đã xác nhận',
  };
  
  return mapStatus[status] || 'Đã hoàn thành';
};

export const truncateText = (text, length = 30) => {
  if (!text) return '';
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

export const getParamsObject = (query) => {
  const params = new URLSearchParams(query);
  const paramsObject = {};
  for (const [key, value] of params) {
    paramsObject[key] = value;
  }
  return paramsObject;
};

export const objectToQueryString = (obj) => {
  return Object.keys(obj)
    .filter(key => obj[key] !== undefined && obj[key] !== null && obj[key] !== '')
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');
};