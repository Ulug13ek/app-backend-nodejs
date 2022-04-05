const router = require("express").Router()
const controller = require("../controllers/user.js")
const {checkAdmin,chekUser} = require("../middleware/checkToken.js")
const {regValidation} = require("../middleware/registerValidation")
const multer = require('multer')
const imageUpload = multer()


router.get("/",checkAdmin, controller.GET)
router.get("/:userId",checkAdmin, controller.GET)
router.get("/users?query", checkAdmin, controller.GET)
router.put("/setting", imageUpload.single('file'),chekUser, regValidation, controller.SETTING)
router.put("/adress", imageUpload.single('file'),chekUser, controller.ADRESS)


module.exports = router