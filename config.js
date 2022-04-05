const fs = require("fs")
require("dotenv").config()

// fs.writeFileSync(".env", "TOKEN_KEY="+("" + Date.now()))

const PORT = process.env.PORT || 1313

const TOKEN_TIME = 60*60*24

const PAGINATION = {
    page:1,
    limit: 20
}

module.exports = {
    TOKEN_TIME,
    PAGINATION,
    PORT
}

