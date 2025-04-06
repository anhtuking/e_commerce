import axios from "../axios";

// API cho quản lý mã giảm giá (coupon)
export const apiGetAllCoupons = () => 
  axios({
    url: '/coupons',
    method: 'get'
  });

export const apiCreateCoupon = (data) =>
  axios({
    url: '/coupons',
    method: 'post',
    data
  });

export const apiUpdateCoupon = (cid, data) =>
  axios({
    url: `/coupons/${cid}`,
    method: 'put',
    data
  });

export const apiDeleteCoupon = (cid) =>
  axios({
    url: `/coupons/${cid}`,
    method: 'delete'
  }); 