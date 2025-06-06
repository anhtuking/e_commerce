const router = require("express").Router();
const ctrls = require("../controllers/coupon");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", [verifyAccessToken, isAdmin], ctrls.createNewCoupon);
router.get("/", ctrls.getCoupons);
router.put("/:cid", [verifyAccessToken, isAdmin], ctrls.updateCoupon);
router.delete("/:cid", [verifyAccessToken, isAdmin], ctrls.deleteCoupon);
router.post("/validate", verifyAccessToken, ctrls.validateCoupon);

module.exports = router;