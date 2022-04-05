const { ClientError } = require("../utils/errors.js")
const timeConverter = require("../utils/time.js")

const GET = (req, res, next) =>{

	try{
        const { userId } = req.params
		const { page = req.PAGINATION.page, limit = req.PAGINATION.limit } = req.query
        
		let users = req.select('users')
		users = users.map(user => {
			delete user.password
			user.createdAt = timeConverter(user.createdAt)
			user.updateAt = timeConverter(user.updateAt)
            user.settingUpdateAt = user.settingUpdateAt ? timeConverter(user.settingUpdateAt): ""
			return user
		})

		if(userId) {
			const user = users.find(user => user.user_id == userId)
			return res.json(user)
		} else {
			const paginatedUsers = users.slice(page * limit - limit, limit * page)
			return res.json(paginatedUsers)
		}

	}catch(error){

		return next(error)
	}
}
const SETTING = (req, res, next)=>{
	try{

		const { userId, username, contact } = req.body
		
		if(!userId) throw new ClientError(400, "userId is required!")

		const users = req.select('users')
		
		
		let user = users.find(user =>userId==user.user_id)
		if(!user) throw new ClientError (400, "User not found")
		
		if(req.file && user){

			const { size, mimetype, buffer, originalname } = req.file
			if(size > (10 * 1024 * 1024)) {
				throw new ClientError(413, "The file larger than 10MB!")
			}
			
			if(!['image/png', 'image/jpeg', 'image/jpg'].includes(mimetype)) {
				throw new ClientError(415, "The file must be jpg/jpeg or png!")
			}
			
			const fileName = Date.now() + originalname.replace(/\s/g, '')
			
			user.profileImg = "/images/"+fileName
			user.settingUpdateAt = Date()
				
			const pathName = path.join(process.cwd(), 'files', 'images', fileName)
			fs.writeFileSync(pathName, buffer)
			req.insert("users", users)
			return res.status(200).json({
				user,
				message: "The user has successfully updated!",
			})
		}
		
		user.settingUpdateAt = Date()
		user.username = username 
		user.contact = contact
		

		req.insert('users', users)
		
		return res.status(200).json({
			user: updateUser,
			message: "The user has successfully updated!",
		})


	}catch(error){
		return next(error)
	}
}

const ADRESS = (req, res, next)=>{

	try { 

		const { userId, adress1, adress2 } = req.body
		if(!userId || !adress1 ) throw new ClientError(400,"userId and adress is required!")
		if(adress1.length < 1 ) throw new ClientError(400, "adress is required")
		if(adress1.length > 150 ) throw new ClientError(413, "adress is too long")

		const users = req.select('users')
		
		let user = users.find(user =>userId==user.user_id)

		if(!user) throw new ClientError (400, "User not found")

		user.adress = adress1
		user.updateAt = Date()

		req.insert('users', users)
		
		return res.status(200).json({
			user,
			message: "The user adress has successfully updated!",
		})


	}catch(error){
		return next(error)
	}
}


module.exports = {
    GET,
	SETTING,
	ADRESS
}