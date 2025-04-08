import axios from "../axios";

// API cho quản lý blog
export const apiGetAllBlogs = () => 
  axios({
    url: '/blog/all',
    method: 'get',
  });

export const apiGetBlog = (bid) =>
  axios({
    url: `/blog/one/${bid}`,
    method: 'get'
  });

export const apiCreateBlog = (data) =>
  axios({
    url: '/blog/',
    method: 'post',
    data
  });

export const apiUpdateBlog = (bid, data) =>
  axios({
    url: `/blog/update/${bid}`,
    method: 'put',
    data
  });

export const apiDeleteBlog = (bid) =>
  axios({
    url: `/blog/delete/${bid}`,
    method: 'delete'
  });

export const apiUploadImageBlog = (bid, formData) =>
  axios({
    url: `/blog/uploadImage/${bid}`,
    method: 'put',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const apiLikeBlog = (bid) =>
  axios({
    url: `/blog/like/${bid}`,
    method: 'put'
  });

export const apiDislikeBlog = (bid) =>
  axios({
    url: `/blog/dislike/${bid}`,
    method: 'put'
  }); 