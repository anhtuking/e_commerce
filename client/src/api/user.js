import axios from "../axios";

export const apiRegister = (data) => axios({
    url: "/user/register",
    method: 'post',
    data,
    withCredentials: true
})

export const apiFinalRegister = (token) => axios({
    url: "/user/finalregister/" + token,
    method: 'put',
})

export const apiLogin = (data) => axios({
    url: "/user/login",
    method: 'post',
    data,
    withCredentials: true
})

export const apiForgotPassword = (data) => axios({
    url: "/user/forgotPassword",
    method: 'post',
    data
})

export const apiResetPassword = (data) => axios({
    url: "/user/resetPassword",
    method: 'put',
    data
})

export const apiGetCurrent = () => axios({
    url: "/user/current",
    method: 'get',
})

export const apiGetUsers = (params) => axios({
    url: "/user/",
    method: 'get',
    params
})

export const apiUpdateUsers = (data, uid) => axios({
    url: "/user/" + uid,
    method: 'put',
    data
})

export const apiDeleteUsers = (uid) => axios({
    url: "/user/" + uid,
    method: 'delete',
})

export const apiUpdateCurrent = (data) => axios({
    url: "/user/current",
    method: 'put',
    data,
})

export const apiUpdateCart = (data) => axios({
    url: "/user/cart",
    method: 'put',
    data,
})

export const apiRemoveCart = (pid, color) => axios({
    url: `/user/remove-cart/${pid}/${color}`,
    method: 'delete',
})

export const apiUpdateWishlist = (pid) => axios({
    url: `/user/wishlist/` + pid,
    method: 'put',
})

export const apiGetUserOrder = (data) => axios({
    url: `/user/orders`,
    method: 'get',
    data,
    withCredentials: true
})

export const apiGetAllOrders = () => axios({
    url: `/user/all-orders`,
    method: 'get',
});

export const apiUpdateOrderStatus = (data) => axios({
    url: "/user/update-status",
    method: 'put',
    data,
    withCredentials: true,
  });
  