const router = require("express").Router();
const ctrls = require('../controllers/admin');
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

// Không yêu cầu xác thực: dùng cho test nếu cần
router.get('/sample-stats', ctrls.getSampleStats);

// Các API cho dashboard – yêu cầu xác thực admin
router.get('/statistics', verifyAccessToken, isAdmin, ctrls.getStatistics);
router.get('/revenue-stats', verifyAccessToken, isAdmin, ctrls.getRevenueStats);
router.get('/top-products', verifyAccessToken, isAdmin, ctrls.getTopProducts);
router.get('/recent-orders', verifyAccessToken, isAdmin, ctrls.getRecentOrders);

module.exports = router;
