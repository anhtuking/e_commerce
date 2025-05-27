import axios from "../axios";

export const apiSearchSimilarProducts = (params) => axios({
    url: "/embedding/search",
    method: 'get',
    params
});

export const apiSearchMultipleCollections = (params) => axios({
    url: "/embedding/search-multiple",
    method: 'get',
    params
});

export const apiGenerateAllEmbeddings = () => axios({
    url: "/embedding/generate-all",
    method: 'post'
});

export const apiGenerateProductEmbedding = (pid) => axios({
    url: "/embedding/generate/" + pid,
    method: 'post'
});

export const apiGenerateMissingEmbeddings = () => axios({
    url: "/embedding/generate-missing",
    method: 'post'
});

export const apiGetEmbeddingStats = () => axios({
    url: "/embedding/stats",
    method: 'get'
});

export const apiGetProductsWithEmbeddingStatus = (params) => axios({
    url: "/embedding/products-status",
    method: 'get',
    params
});

export const apiGenerateAllBlogEmbeddings = () =>
  axios({
    url: '/embedding/generate-all-blogs',
    method: 'post',
  });

export const apiGenerateBlogEmbedding = (bid) =>
  axios({
    url: `/embedding/generate-blog/${bid}`,
    method: 'post',
  });

export const apiGenerateAllCouponEmbeddings = () =>
  axios({
    url: '/embedding/coupons/generate-all',
    method: 'post',
  });

export const apiGenerateCouponEmbedding = (couponId) =>
  axios({
    url: `/embedding/coupons/generate/${couponId}`,
    method: 'post',
  }); 