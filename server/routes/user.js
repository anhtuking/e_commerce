const router = require("express").Router();
const ctrls = require("../controllers/user");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require('../config/cloudinary.config');

router.post("/register", ctrls.register);
// router.post("/mock", ctrls.createUsers);
router.put("/finalregister/:token", ctrls.finalRegister);
router.post("/login", ctrls.login);
router.get("/current", verifyAccessToken, ctrls.getCurrent);
router.post("/refreshToken", ctrls.refreshAccessToken);
router.get("/logout", ctrls.logout);
router.post("/forgotPassword", ctrls.forgotPassword);
router.put("/resetPassword", ctrls.resetPassword);
router.get("/", [verifyAccessToken, isAdmin], ctrls.getUsers);
router.put("/current", [verifyAccessToken], uploader.single("avatar"), ctrls.updateUser);
router.put("/address", [verifyAccessToken], ctrls.updateUserAddress);
router.put("/cart", [verifyAccessToken], ctrls.updateCart);
router.get("/orders", [verifyAccessToken], ctrls.getUserOrder);
router.delete("/remove-cart/:pid/:color", [verifyAccessToken], ctrls.removeCart);
router.delete("/:uid", [verifyAccessToken, isAdmin], ctrls.deleteUser);
router.put("/:uid", [verifyAccessToken, isAdmin], ctrls.updateUserByAdmin);
router.put("/wishlist/:pid", [verifyAccessToken], ctrls.updateWishlist);
module.exports = router;
//   CRUD | Create - Read - Update - Delete
// Method | POST - GET - PUT - DELETE
// Create(POST) + PUT : body
// GET + DELETE : query
