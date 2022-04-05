const router = require("express").Router()
const { adminsValidation }  = require("../middleware/registerValidation.js")
const controller = require("../controllers/admin.js")
const {checkAdmin} = require("../middleware/checkToken.js")

router.post("/login",  controller.LOGIN)
router.post("/register",checkAdmin, adminsValidation, controller.REGISTER)
router.get("/:adminId", checkAdmin, controller.GET)
router.get("/admins?query", checkAdmin, controller.GET)
router.put("/", checkAdmin, adminsValidation, controller.UPDATE)


module.exports = router