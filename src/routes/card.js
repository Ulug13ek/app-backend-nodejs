const router = require("express").Router()
const controller = require("../controllers/card.js")
const {chekUser} = require("../middleware/checkToken.js")


router.get("/", chekUser, controller.GET)
router.post("/add",  chekUser,  controller.POST)
router.put("/", chekUser, controller.PUT)
router.put("/buy", chekUser, controller.BUY)


module.exports = router