const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const data = require('../../data/ecommerce.json')
const slugify = require('slugify')
const categoryData = require('../../data/cate_brand')
const ProductCategory = require('../models/productCategory')

const fn = async (product) => {
    await Product.create({
        title: product?.name,
        slug: slugify(product?.name) + Math.round(Math.random() * 100) + '',
        description: product?.description,
        brand: product?.brand,
        price: Math.round(Number(product?.price?.match(/\d/g).join('')) / 100),
        category: product?.category[1],
        quantity: Math.round(Math.random() * 1000),
        sold: Math.round(Math.random() * 100),
        images: product?.images,
        color: product?.variants?.find(el => el.label === 'Color')?.variants[0]
    })
}

const insertProduct = asyncHandler(async (req, res) => {
    const promises = []
    for (let product of data) promises.push(fn(product))
    await Promise.all(promises)
    return res.status(200).json('Done.')
});

const fn2 = async (cate) => {
    await ProductCategory.updateOne(
        { title: cate.cate }, // Điều kiện tìm kiếm
        { $set: { title: cate.cate, brand: cate.brand } }, // Dữ liệu cập nhật
        { upsert: true } // Tùy chọn upsert
    );
}

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