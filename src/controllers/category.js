const { ClientError } = require('../utils/errors.js')
const timeConverter = require("../utils/time.js")

const GET = (req, res, next) => {

	try {
		
        const { categoryId } = req.params        
		let categories = req.select('categories')
		categories = categories.map(category => {
			category.createdAt = timeConverter(category.createdAt)
			category.updateAt =  category.updateAt ? timeConverter(category.updateAt) : ""
			return category
		})

		if(categoryId) {
			const category = categories.find(category => category.category_id == categoryId)
			return res.json(category)
		} else return res.json(categories)
		
	} catch(error) {
		return next(error)
	}
}


const ADD_CATEGORY = (req,res,next) =>{
	try {

		const categories = req.select('categories')
		const { category_name } = req.body

		if(!category_name) throw new ClientError(400, "category_name is required!")
		if(category_name.length <1 ) throw new ClientError(400,"category name is require")
		if(category_name.length > 20) throw new ClientError(413, "category name is too long")
		
		const found = categories.find(category=>  category.category_name == category_name)

		if (found) throw new ClientError(400,"category alredy exists")

		const newCategory = {
			category_id: categories.length ? categories[categories.length-1].category_id +1 : 1,
			category_name,
			createdAt: Date()
		}

		categories.push(newCategory)
		req.insert('categories', categories)

		res.status(201).json({
			category: newCategory,
			message: "The category has successfully added!",
		})
		
	} catch(error) {
		return next(error)
	}
}

const UPDATE = (req, res, next)=>{
	try{

		const { categoryId, category_name } = req.body
		
		const categories = req.select('categories')

        	if(!categoryId) throw new ClientError(400, "categoryId is required!")
		
		const category = categories.find(category =>categoryId==category.category_id)
	
		if(!category) throw new ClientError (400, "category not found")

		const updateCategory = categories.map(category => {
				
			if (category.category_id == categoryId){
				category.updateAt = Date()
				category.category_name=category_name ? category_name : category.category_name
			}
			return category
		})

		req.insert('categories', updateCategory)
		
		return res.status(200).json({
			category,
			message: "The category has successfully updated!",
		})


	}catch(error){
		return next(error)
	}
}


const DELETE = (req, res, next) => {
	try {
		let { categoryId } = req.body

		if(!categoryId) {
			throw new ClientError(400, "categoryId is required!")
		}

		let categories = req.select('categories')
		const found = categories.findIndex(category => category.category_id == categoryId)

		if(found == -1) {
			throw new ClientError(404, "There is no such category!")
		}

		const category = categories.splice(found, 1)

		req.insert('categories', categories)

		return res.status(201).json({
			category: category,
			message:"The category is deleted!"
		})

	} catch(error) {
		return next(error)
	}
}

module.exports = {
	GET,
    	ADD_CATEGORY,
	UPDATE,
    	DELETE
}
