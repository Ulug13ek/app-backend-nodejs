const router = require("express").Router()
const { regValidation }  = require("../middleware/registerValidation.js")
const controller = require("../controllers/auth.js")


router.post("/register", regValidation, controller.REGISTER)



module.exports = router