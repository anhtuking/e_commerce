require('dotenv').config();
const moment = require('moment');
const querystring = require('qs');
const crypto = require('crypto');
const Payment = require("../models/order");
const asyncHandler = require("express-async-handler");

// VNPAY Config
const vnp_TmnCode = "1KKD5I85";  // Terminal ID mới
const vnp_HashSecret = "2GG49RWL9EL6WP3BFU14QC6SD9Z0JSPH";  // Secret Key mới
const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const vnp_ReturnUrl = "http://localhost:3000/payment-success";

const createPaymentUrl = async (req, res) => {
    try {
        const { amount, orderDescription, orderType, language } = req.body;
        
        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');
        
        let ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        let tmnCode = vnp_TmnCode;
        let secretKey = vnp_HashSecret;
        let vnpUrl = vnp_Url;
        let returnUrl = vnp_ReturnUrl;
        let orderId = moment(date).format('DDHHmmss');
        
        let currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = language || 'vn';
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderDescription || 'Thanh toan don hang';
        vnp_Params['vnp_OrderType'] = orderType || 'billpayment';
        vnp_Params['vnp_Amount'] = Math.round(amount) * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;

        vnp_Params = sortObject(vnp_Params);

        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
        vnp_Params['vnp_SecureHash'] = signed;

        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        console.log("Generated VNPAY URL:", vnpUrl);
        res.status(200).json({ code: '00', data: vnpUrl })
    } catch (error) {
        console.error('Payment Error:', error);
        res.status(500).json({ code: '99', message: 'Payment error', error: error.message });
    }
}

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj){
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

const createPaymentRecord = asyncHandler(async (req, res) => {
    const { orderId } = req.body;
    const existingPayment = await Payment.findOne({ orderId });
    if (existingPayment) {
      return res.status(200).json({ success: true, payment: existingPayment });
    }
    const payment = await Payment.create(req.body);
    return res.status(200).json({
      success: payment ? true : false,
      payment: payment ? payment : "Có lỗi xảy ra khi lưu thông tin hóa đơn",
    });
});

const createOrder = asyncHandler(async (req, res) => {
    let { orderCode } = req.body;
    if (!orderCode) {
      orderCode = "ORDER" + Date.now(); // Sinh giá trị duy nhất
      req.body.orderCode = orderCode;
    }
    // Kiểm tra trùng lặp nếu cần
    const existingOrder = await Order.findOne({ orderCode });
    if (existingOrder) {
      return res.status(200).json({ success: true, order: existingOrder });
    }
    const order = await Order.create(req.body);
    res.status(200).json({
      success: order ? true : false,
      order: order ? order : "Có lỗi xảy ra khi tạo order",
    });
  });
  

module.exports = { createPaymentUrl, createPaymentRecord }; 