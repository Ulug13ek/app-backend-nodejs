const { ClientError, ServerError} = require("./errors.js")
const { TOKEN_TIME } = require("../../config.js")
const jwt = require("jsonwebtoken")

module.exports = {
    sign: (payload) => {
        try {
            return jwt.sign(payload, process.env.TOKEN_KEY, {expiresIn:TOKEN_TIME})
        } catch(error){
            throw new ServerError(error.message)
        }
    },
    verify: (token) => {
        try{
            return jwt.verify(token, process.env.TOKEN_KEY)
        }catch(error){
            throw new ClientError(401,error.message)
        }
    }
}