const { ClientError } = require('../utils/errors.js')
const { sign } = require('../utils/jsonwebtoken.js')
const path = require('path')
const fs = require('fs')
const uuid = require("uuid")


const REGISTER = (req,res,next) =>{
	try {

		const users = req.select('users')
		const { username, contact } = req.body

		if(!username || !contact) throw new ClientError(400, "username and contact are required!")

		const found = users.find(user => user.contact == contact)

		if(found) {

			let updateUser = users.map(user => {
				
				if (user.contact == contact){
					user.updateAt = Date()
				}
				return user
			})

			req.insert('users', updateUser)
			
			return res.status(200).json({
				user: found,
				message: "The user has successfully logged in!",
				token: sign({ userId: found.user_id, contact:found.contact, agent: req.headers['user-agent']})
			})
		}
		const newUser = {
			user_id: uuid.v4()/*users.length ? users[users.length - 1].user_id + 1 : 1*/,
			username,
			profileImg: "/images/" + "avatar.jpg",
			contact,
			createdAt: Date()
		}

		users.push(newUser)
		req.insert('users', users)

		res.status(201).json({
			user: newUser,
			message: "The user has successfully registered!",
			token: sign({ userId: newUser.userId, agent: req.headers['user-agent'] })
		})
		
	} catch(error) {
		return next(error)
	}
}


module.exports = {
    REGISTER
}