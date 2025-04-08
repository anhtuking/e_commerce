import axios from "../axios";

// API cho quản lý mã giảm giá (coupon)
export const apiGetAllCoupons = () => 
  axios({
    url: '/coupon/',
    method: 'get'
  });

export const apiCreateCoupon = (data) =>
  axios({
    url: '/coupon/',
    method: 'post',
    data
  });

export const apiUpdateCoupon = (cid, data) =>
  axios({
    url: `/coupon/${cid}`,
    method: 'put',
    data
  });

export const apiDeleteCoupon = (cid) =>
  axios({
    url: `/coupon/${cid}`,
    method: 'delete'
  });

export const apiValidateCoupon = (data) =>
  axios({
    url: '/coupon/validate',
    method: 'post',
    data
  }); 