import React, { useEffect, useState } from "react";

const useDebounce = (value, ms) => {
    const [debounceValue, setDebounceValue] = useState('');

    useEffect(() => {
        setTimeout(() => { 
            setDebounceValue(value)
         }, ms)
    }, [value, ms]);

    return debounceValue;
}

export default useDebounce

// Mục đích: Khi nhập thay đổi giá trị sẽ gọi API
// Vấn đề: Gọi API liên tục theo mỗi lượt nhập
// Giải pháp: Chỉ call API khi người dùng nhập xong
// Thời gian onChange

// Tách price thành 2 biến
// 1. Biến để phục vụ UI, gõ tới đâu thì lưu tới đó => UI render
// 2. Biến thứ hai dùng để quyết định call API => setTimeout => biến sẽ gắn sau một khoảng thời gian