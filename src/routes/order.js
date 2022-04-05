const router = require("express").Router()
const controller = require("../controllers/order.js")
const {chekUser, checkAdmin} = require("../middleware/checkToken.js")


router.get("/", chekUser, controller.GET)
router.get("/:userId", checkAdmin, controller.AGET)
router.put("/status", checkAdmin, controller.PUT)


module.exports = router