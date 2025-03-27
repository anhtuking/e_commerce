import axios from "../axios";

export const apiSavePayment = (data) => axios({
    url: "/payment/save",
    method: "post",
    data,
    withCredentials: true
});