const { ClientError } = require('../utils/errors.js')
const Joi = require("joi")

const userValidation = Joi.object({
	username: Joi.string().max(30).alphanum().required(),
	contact: Joi.string().length(12).pattern(new RegExp(/^998(9[012345789]|3[3]|7[1]|8[8])[0-9]{7}$/)).required()
})

const regValidation = (req, res, next)=>{

	const body = {

		username: req.body.username,
		contact: req.body.contact

	}
	
    const { value, error } = userValidation.validate(body)
    
	if(error) return next(new ClientError(400, error))

	return next()

}

const adminValidation = Joi.object({
	adminName: Joi.string().max(30).alphanum().required(),
	password: Joi.string().min(5).max(15).pattern(new RegExp(/(?=.*[A-Za-z]+)(?=.*[0-9]+)/)).required()
})


const adminsValidation = (req, res, next) => {
	
	const body = {

		adminName: req.body.adminName,
		password: req.body.password

	}
	const { value, error } = adminValidation.validate(body)

	if(error) return next( new ClientError(400, error) )

	return next()
}

module.exports = {
    regValidation,
	adminsValidation
}