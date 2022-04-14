const { ClientError } = require("../utils/errors.js")
const timeConverter = require("../utils/time.js")
const fs = require("fs")
const path = require("path")

const GET = (req, res, next) =>{

	try{
        const { productId } = req.params
		const { page = req.PAGINATION.page, limit = req.PAGINATION.limit, search="" } = req.query
		let products = req.select('products')
		products = products.map(product => {

			product.createdAt = timeConverter(product.createdAt)
			product.updateAt = product.updateAt ? timeConverter(product.updateAt):""

			return product
		})

		if(productId) {
			const product = products.find(product => product.product_id == productId)
			return res.json(product)
		} else {
            products = products.filter(product => {
                    let searchFilter = search ? product.product_name.toLowerCase().includes(search.toLowerCase().trim()) : true
    
                return searchFilter
            })
            
			const paginatedProduct = products.slice(page * limit - limit, limit * page)
			return res.json(paginatedProduct)
		}

	}catch(error){

		return next(error)
	}
}

const ADD_PRODUCT = (req,res,next) =>{
	try {

		const products = req.select('products')
		const { product_name, categoryId, bio, price } = req.body
		
		if(!product_name || !categoryId || !bio || !price ) throw new ClientError(400, "product_name, categoryId, bio or price is required!")
		
		if(!req.file) throw new ClientError(400, "productImg is required")

		const { size, mimetype, buffer, originalname } = req.file
		if(!['image/png', 'image/jpeg', 'image/jpg'].includes(mimetype)) {
			throw new ClientError(415, "The file must be jpg/jpeg or png!")
		}
		if(size > (10 * 1024 * 1024)) {
			throw new ClientError(413, "The file larger than 10MB!")
		}
		if(product_name.length < 1) {
			throw new ClientError(400, "product name is required!")
		}
		if(product_name.length > 30) {
			throw new ClientError(413, "product name is too long!")
		}
		if(bio.length < 1) {
			throw new ClientError(400, "videoTitle is required!")
		}

		if(bio.length > 100) {
			throw new ClientError(413, "product bio is too long!")
		}
		
		const fileName = Date.now() + originalname.replace(/\s/g, '')
		
		const pathName = path.join(process.cwd(), 'files', 'product_images', fileName)
		fs.writeFileSync(pathName, buffer)

		const newProduct = {
			product_id: products.length ? products[products.length-1].product_id +1 : 1,
			product_name,
			product_img:"/product_images/"+fileName,
			category_id: categoryId,
			product_bio: bio,
			product_price: price,
			createdAt: Date()
		}


		products.push(newProduct)
		req.insert('products', products)

		return res.status(200).json({
			product:newProduct,
			message: "The product has successfully added!",
		})

		
		
	} catch(error) {
		return next(error)
	}
}

const UPDATE = (req, res, next)=>{

	try{

		let { productId, product_name, categoryId, price, bio } = req.body
		
		if(!productId || !product_name || !categoryId || !price || !bio) throw new ClientError(400, "productId product_name categoryId price or bio is required!")
		
		product_name = product_name.trim()

		if(bio.length < 1) throw new ClientError(400, "bio is required!")
		

		if(bio.length > 100) throw new ClientError(413, "bio is too long!")
		

		if(product_name.length < 1) throw new ClientError(400, "product name is required!")
		

		if(product_name.length > 30) throw new ClientError(413, "product name is too long!")
		


		const products = req.select('products')
		
		const found = products.find(product => product.product_id == productId)

		if(!found) throw new ClientError(404, "There is no such product!")

		if(req.file){

			const { size, mimetype, buffer, originalname } = req.file

			if(!['image/png', 'image/jpeg', 'image/jpg'].includes(mimetype)) {
				throw new ClientError(415, "The file must be jpg/jpeg or png!")
			}
			if(size > (10 * 1024 * 1024)) {
				throw new ClientError(413, "The file larger than 10MB!")
			}
			
			const fileName = Date.now() + originalname.replace(/\s/g, '')
			
			const pathName = path.join(process.cwd(), 'files', 'product_images', fileName)

			fs.unlinkSync(path.join(process.cwd(), 'files', found.product_img))

			found.product_name = product_name
			found.category_id = categoryId
			found.product_price = price
			found.product_bio = bio
			found.product_img = "/product_images/"+fileName
			found.updateAt = Date()

			fs.writeFileSync(pathName, buffer)
			req.insert("products", products)
			
			return res.status(200).json({
				product: found,
				message: "The product has successfully updated!",
			})
		}

		found.product_name = product_name
		found.category_id = categoryId
		found.product_price = price
		found.product_bio = bio
		found.updateAt = Date()

		req.insert('products', products)

		return res.status(201).json({
			product: found,
			message:"The product updated!"
		})



	}catch(error){
		return next(error)
	}
}


const DELETE = (req, res, next) => {
	try {

		let { productId } = req.body

		if(!productId) throw new ClientError(400, "productId is required!")
		

		const products = req.select('products')
		const found = products.findIndex(product => product.product_id == productId)

		if(found == -1) throw new ClientError(404, "There is no such product!")
	

		const [ deletedProduct ] = products.splice(found, 1)
		fs.unlinkSync(path.join(process.cwd(), 'files', deletedProduct.product_img))

		req.insert('products', products)

		return res.status(201).json({
			product: deletedProduct,
			message:"The product is deleted!"
		})


	} catch(error) {
		return next(error)
	}
}

module.exports = {
    GET,
    ADD_PRODUCT,
    UPDATE,
    DELETE
}
