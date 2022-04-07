const { ClientError } = require('../utils/errors.js')
const { verify } = require('../utils/jsonwebtoken.js')

const chekUser = (req, res, next)=>{

	try {
		const { token } = req.headers

        if(!token) {
			throw new ClientError(401, "user is not authorized!")
		}

		const { userId, agent } = verify(token)

		if(!(req.headers['user-agent'] == agent)) {
			throw new ClientError(401, "token is invalid!")
		}

		const users = req.select('users')
		let user = users.find(user => user.user_id == userId)

		if(!user) {
			throw new ClientError(401, "The token is invalid!")
		}

		req.userId = userId

		return next()

	} catch(error) {

        return next(error)
    }	
}

const checkAdmin = (req,res, next) =>{

	try {

		const { token } = req.headers
        if(!token) throw new ClientError(401, "admin is not authorized!")


		const { adminId, agent } = verify(token)
		if(!(req.headers['user-agent'] == agent)) throw new ClientError(401, "admin token is invalid!")
	

		const admins = req.select('admins')
		let admin = admins.find(admin => admin.admin_id == adminId)

		if(!admin) 	throw new ClientError(401, "The admin token is invalid!")
	

		req.adminId = adminId

		return next()

	} catch(error) {

        return next(error)
    }
}


module.exports = {
	chekUser,
	checkAdmin
}