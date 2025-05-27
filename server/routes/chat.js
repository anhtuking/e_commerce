const express = require('express');
const router = express.Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

// Xử lý lỗi tạm thời cho các function bị xóa
const tempHandler = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Chức năng này đã bị vô hiệu hóa'
  });
};

// Routes được giữ lại nhưng trả về thông báo đã vô hiệu hóa
router.post('/feedback', verifyAccessToken, tempHandler);
router.get('/similar', tempHandler);
router.post('/conversation', verifyAccessToken, tempHandler);
router.get('/conversation/:id', verifyAccessToken, tempHandler);
router.get('/positive-feedbacks', verifyAccessToken, isAdmin, tempHandler);
router.get('/negative-feedbacks', verifyAccessToken, isAdmin, tempHandler);

module.exports = router; 