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

export const formatPrice = (number) =>
  Number(number?.toFixed(1)).toLocaleString();

export const renderStarFromNumber = (number, size) => {
  // 4 => [1,1,1,1,0]
  // 3 => [1,1,1,0,0]
  if (!Number(number)) return;

  const stars = [];
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
