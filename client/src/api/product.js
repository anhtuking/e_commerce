import axios from "../axios";

export const apiGetProducts = (params) => axios({
    url: "/product/",
    method: 'get',
    params
})

export const apiGetProduct = (pid) => axios({
    url: "/product/" + pid,
    method: 'get'
})

export const apiRatings = (data) => axios({
    url: "/product/ratings",
    method: 'put',
    data
})

export const apiCreateProduct = (data) => axios({
    url: "/product/",
    method: 'post',
    data
})

export const apiUpdateProduct = (data, pid) => axios({
    url: "/product/" + pid,
    method: 'put',
    data
})

export const apiDeleteProduct = (pid) => axios({
    url: "/product/" + pid,
    method: 'delete',
})

export const apiAddVariant = (data, pid) => axios({
    url: "/product/variant/" + pid,
    method: 'put',
    data
})

// API đồng bộ embedding sau khi tạo hoặc cập nhật sản phẩm
export const apiSyncProductEmbedding = (pid) => axios({
    url: "/embedding/generate/" + pid,
    method: 'post',
})