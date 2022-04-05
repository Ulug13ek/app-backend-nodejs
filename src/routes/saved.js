const router = require("express").Router()
const controller = require("../controllers/saved.js")
const {chekUser} = require("../middleware/checkToken.js")


router.get("/",chekUser, controller.GET)
router.post("/add",  chekUser,  controller.POST)
router.delete("/:savedId", chekUser, controller.CHANGE)
router.delete("/", chekUser, controller.DELETE)


module.exports = router