const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const data = require('../../data/ecommerce.json')
const slugify = require('slugify')
const categoryData = require('../../data/cate_brand')
const ProductCategory = require('../models/productCategory')

const fn = async (product) => {
    const parsePrice = (str) =>
        parseFloat((str || '').replace(/[^\d]/g, '')) || 0;

    // Xử lý variants
    const variants = product?.variants && Array.isArray(product?.variants)
      ? product.variants.map((variant) => ({
          color: variant?.color,
          price: parsePrice(variant?.price),
          thumb: variant?.thumb,
          sku: variant?.sku || slugify(`${product.name}-${variant.color}`) + "-" + Math.round(Math.random() * 1000)
        }))
      : [];

    const detailedDescription = Array.isArray(product?.description)
      ? product.description.join('\n')
      : product?.description || '';

    // Lấy nội dung 'describe' từ infomations 
    const extraDescription = product?.infomations?.describe || '';

    // Tạo document mới
    await Product.create({
        title: product?.name,
        slug: slugify(product?.name) + "-" + Math.round(Math.random() * 100),
        description: detailedDescription,             // Lưu mô tả gốc
        longDescription: extraDescription,            // Tạo thêm trường để lưu chuỗi (hoặc mảng) từ infomations
        brand: product?.brand,
        price: parseFloat(product?.price.replace(/[^\d,]/g, '').replace(',', '.')), 
        category: product?.category?.[0] || "",
        quantity: Math.floor(Math.random() * 1000) + 1, 
        sold: Math.floor(Math.random() * 100),
        images: product?.images,
        color: product?.variants?.[0]?.color || "No Color",
        variants: variants,
        thumb: product?.thumb,
        // Nếu vẫn muốn lưu toàn bộ object infomations (ngoài phần describe), để sau này dùng:
        infomations: product?.infomations,
        totalRatings: 0
    });
};


const insertProduct = asyncHandler(async (req, res) => {
    const promises = []
    for (let product of data) promises.push(fn(product))
    await Promise.all(promises)
    return res.status(200).json('Done.')
});

const fn2 = async (cate) => {
    await ProductCategory.updateOne(
        { title: cate.cate }, 
        { $set: { title: cate.cate, brand: cate.brand, image: cate.image } }, 
        { upsert: true } 
    );
}
// const fn2 = async (cate) => {
//     const existingCategory = await ProductCategory.findOne({ title: cate.cate });
//     if (existingCategory) {
//         const updatedBrands = [...new Set([...existingCategory.brand, ...cate.brand])]; 
//         await ProductCategory.updateOne(
//             { title: cate.cate }, 
//             { $set: { brand: updatedBrands } }
//         );
//     } else {
//         await ProductCategory.create({ title: cate.cate, brand: cate.brand });
//     }
// }

const insertCaterory = asyncHandler(async (req, res) => {
    const promises = []
    // console.log(categoryData);
    for (let cate of categoryData) promises.push(fn2(cate))
    await Promise.all(promises)
    return res.status(200).json('Done.')
});

module.exports = {
    insertProduct,
    insertCaterory
  };