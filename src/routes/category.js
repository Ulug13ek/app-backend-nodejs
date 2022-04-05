const router = require("express").Router()
const controller = require("../controllers/category.js")
const {checkAdmin} = require("../middleware/checkToken.js")

router.get("/", controller.GET)
router.get("/:categoryId", controller.GET)
router.post("/add",checkAdmin, controller.ADD_CATEGORY)
router.put("/update", checkAdmin, controller.UPDATE)
router.delete("/", checkAdmin, controller.DELETE)


module.exports = router