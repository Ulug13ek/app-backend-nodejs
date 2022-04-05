const { ClientError } = require('../utils/errors.js')
const { sign } = require('../utils/jsonwebtoken.js')
const sha256 = require('sha256')
const uuid = require("uuid")


const GET = (req, res, next) => {

	try {
		
		const { adminId } = req.params
		const { page = req.PAGINATION.page, limit = req.PAGINATION.limit } = req.query
        
		let admins = req.select('admins')
		admins = admins.map(admin => {
			delete admin.password
			admin.createdAt = timeConverter(admin.createdAt)
			admin.updateAt = timeConverter(admin.updateAt)
			return user
		})

		if(adminId) {
			const admin = admins.find(admin => admin.admin_id == adminId)
			return res.json(admin)
		} else {
			const paginatedAdmin = admins.slice(page * limit - limit, limit * page)
			return res.json(paginatedAdmin)
		}
		
	} catch(error) {
		return next(error)
	}
}



const LOGIN = (req, res, next) => {

	try {
		const { adminName, password } = req.body
		if(!adminName || !password) throw new ClientError(400, "adminName and password are required!")

		const admins = req.select('admins')
		const admin = admins.find(admin => admin.adminName == adminName && admin.password == sha256(password))
		if(!admin) throw new ClientError(404, "Wrong adminName or password!")

		delete admin.password
		return res.status(200).json({
			admin,
			message: "The admin has successfully logged in!",
			token: sign({ adminId: admin.admin_id, agent: req.headers['user-agent'] })
		})
		
	} catch(error) {
		return next(error)
	}
}


const REGISTER = (req,res,next) =>{
	try {

		const admins = req.select('admins')
		const { adminName, password } = req.body

		if(!adminName || !password) throw new ClientError(400, "adminName and password are required!")

		const found = admins.find(admin => admin.password == sha256(password) && admin.adminName == adminName)

		if (found) throw new ClientError(400,"adminName and password alredy exists")

		const newAdmin = {
			admin_id: uuid.v4(),
			adminName,
            		password: sha256(password),
			createdAt: Date()
		}

		admins.push(newAdmin)
		req.insert('admins', admins)

        	delete newAdmin.password
		res.status(201).json({
			admin: newAdmin,
			message: "The admin has successfully registered!",
			token: sign({ adminId: newAdmin.admin_id, agent: req.headers['user-agent'] })
		})
		
	} catch(error) {
		return next(error)
	}
}

const UPDATE = (req, res, next)=>{
	try{

		const { adminId, adminName, password } = req.body
		
		if(!adminId) throw new ClientError(400, "adminId is required!")
		
		const admins = req.select('admins')
		
		const admin = admins.find(admin =>adminId==admin.admin_id)
	
		if(!admin) throw new ClientError (400, "User not found")

		const updateAdmin = admins.map(admin => {
				
			if (admin.admin_id == adminId){
				admin.updateAt = Date()
				admin.adminName=adminName ? adminName : admin.adminName
				admin.password = password ? password : admin.password
			}
			return admin
		})

		req.insert('admins', updateAdmin)
		
		return res.status(200).json({
			admin,
			message: "The admin has successfully updated!",
		})


	}catch(error){
		return next(error)
	}
}

module.exports = {
	GET,
    	LOGIN,
    	REGISTER,
	UPDATE
}
