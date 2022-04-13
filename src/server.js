const { ServerError } = require('./utils/errors.js')
const timeConverter = require('./utils/time.js')
const { PORT } = require("../config.js")
const express = require("express")
const cors = require("cors")
const path = require("path")
const fs = require("fs")
const app = express()

const modelMiddleware = require('./middleware/model.js')
const paginationMiddleware = require('./middleware/pagination.js')

app.use(cors({
	origin: "*",
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	preflightContinue: false
}))

app.use(express.json())
app.use(modelMiddleware)
app.use(paginationMiddleware)
app.use(express.static(path.join(process.cwd(), 'files')))

const authRouter = require("./routes/auth.js")
const userRouter = require("./routes/user.js")
const adminRouter = require("./routes/admin.js")
const categoryRouter = require("./routes/category.js")
const productRouter = require("./routes/product.js")
const savedRouter = require("./routes/saved.js")
const cardRouter = require("./routes/card.js")
const orderRouter = require("./routes/order.js")

app.use("/user", authRouter)
app.use("/categories", categoryRouter)
app.use("/products", productRouter)
app.use("/users", userRouter)
app.use("/admins", adminRouter)
app.use("/saveds", savedRouter)
app.use("/cards", cardRouter)
app.use("/orders", orderRouter)


app.use((error, req, res, next) => {

	if([400, 401, 404, 413, 415].includes(error.status)) {
		return res.status(error.status).send(error)

	} 
	
	fs.appendFileSync(

		path.join(process.cwd(), 'log.txt'),
		`${timeConverter(new Date())}  ${req.method}  ${req.url}  "${error.message}"\n`
		
	)

	return res.status(500).send(new ServerError(""))
})

app.listen(PORT, ()=>console.log("server is running http://localhost":"+PORT))
