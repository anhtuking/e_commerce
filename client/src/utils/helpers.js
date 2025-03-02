export const createSlug = (string) => {
    if (!string) return ""; // Tránh lỗi nếu string là undefined
    return string
        .toLowerCase()  //chuyển thành chữ thường
        .normalize("NFD")   //bỏ dấu 
        .replace(/[\u0300-\u036f]/g, "")   
        .split(" ") //chuyển thành mảng có khoảng cáchcách
        .join("-"); //join mảng lại theo dấu -
};

export const formatPrice = number => Number(number.toFixed(1)).toLocaleString()