import axios from "../axios";

// API cho quản lý blog
export const apiGetAllBlogs = (params) => 
  axios({
    url: '/blogs',
    method: 'get',
    params
  });

export const apiGetBlog = (bid) =>
  axios({
    url: `/blogs/${bid}`,
    method: 'get'
  });

export const apiCreateBlog = (data) =>
  axios({
    url: '/blogs',
    method: 'post',
    data
  });

export const apiUpdateBlog = (bid, data) =>
  axios({
    url: `/blogs/${bid}`,
    method: 'put',
    data
  });

export const apiDeleteBlog = (bid) =>
  axios({
    url: `/blogs/${bid}`,
    method: 'delete'
  });

export const apiUploadImageBlog = (bid, formData) =>
  axios({
    url: `/blogs/upload-image/${bid}`,
    method: 'put',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const apiLikeBlog = (bid) =>
  axios({
    url: `/blogs/like/${bid}`,
    method: 'put'
  });

export const apiDislikeBlog = (bid) =>
  axios({
    url: `/blogs/dislike/${bid}`,
    method: 'put'
  }); 