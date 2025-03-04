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

export const formatPrice = number => Number(number?.toFixed(1)).toLocaleString()

export const renderStarFromNumber = (number, size) => {
  // 4 => [1,1,1,1,0]
  // 3 => [1,1,1,0,0]
  if (!Number(number)) return;

  const stars = [];
  for (let i = 0; i < +number; i++)
    stars.push(<MdOutlineStar color="orange" size={size || 16}/>);
  for (let i = 5; i > +number; i--)
    stars.push(<MdOutlineStarBorder color="orange" size={size || 16}/>);

  return stars;
};
