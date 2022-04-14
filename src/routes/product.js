const router = require("express").Router()
const controller = require("../controllers/product.js")
const {checkAdmin} = require("../middleware/checkToken.js")
const multer = require('multer')
const imageUpload = multer()


router.get("/", controller.GET)
router.get("/:productId", controller.GET)
router.get("/?search", controller.GET)
router.post("/add",  checkAdmin,imageUpload.single('file'),  controller.ADD_PRODUCT)
router.put("/update",  checkAdmin, imageUpload.single('file'), controller.UPDATE)
router.delete("/", checkAdmin, controller.DELETE)


module.exports = router
