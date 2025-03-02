const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const data = require('../../data/ecommerce.json')
const slugify = require('slugify')
const categoryData = require('../../data/cate_brand')
const ProductCategory = require('../models/productCategory')

const fn = async (product) => {
    await Product.create({
        title: product?.name,
        slug: slugify(product?.name) + "-" + Math.round(Math.random() * 100),
        description: product?.description?.join(", "), 
        brand: product?.brand,
        price: parseFloat(product?.price.replace(/[^\d,]/g, '').replace(',', '.')), 
        category: product?.category.join(" > "),
        quantity: Math.floor(Math.random() * 1000) + 1, 
        sold: Math.floor(Math.random() * 100), 
        images: product?.images,
        color: product?.variants?.find(el => el.label.toLowerCase() === 'color')?.variants[0] || "No Color",
        thumb: product?.thumb
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
        { $set: { title: cate.cate, brand: cate.brand } }, 
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