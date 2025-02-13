const router = require('express').Router()
const ctrls = require("../controllers/blog");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewBlog)
router.get('/', ctrls.getAllBlogs)
router.delete('/delete/:bid', [verifyAccessToken, isAdmin], ctrls.deleteBlog)
router.put('/update/:bid', [verifyAccessToken, isAdmin], ctrls.updateBlog)
router.put('/like/:bid', [verifyAccessToken], ctrls.likeBlog)
router.put('/dislike/:bid', [verifyAccessToken], ctrls.dislikeBlog)

module.exports = router