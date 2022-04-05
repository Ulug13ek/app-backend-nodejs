const { ClientError } = require('../utils/errors.js')
const timeConverter = require("../utils/time.js")

const GET = (req, res, next) => {

	try {
		
        const { userId } = req.body

        if(userId != req.userId) throw new ClientError(400,"userId does not match!")

		let cards = req.select('carts')
		let products = req.select('products')

        let cart = cards.filter(card => card.user_id == userId && card.isPaid == false)
        
        if(!cart.length) return res.json(cart)
        
		cart = cart.map(card => {

			card.createdAt = timeConverter(card.createdAt)
			card.updateAt =  card.updateAt ? timeConverter(card.updateAt) : ""
            card.product = products.find(product => product.product_id == card.product_id)
			return card
		})

        const total = cart.reduce((acc, el)=>{
            return acc+(+el.product.product_price)
        },0)

        
        cart.push({total})

        return res.json(cart)
      
        
	} catch(error) {
		return next(error)
	}
}


const POST = (req,res,next) =>{
	try {

		const { userId, productId } = req.body
        
		if(!userId || !productId) throw new  ClientError(400, "userId and productId is required!")
		if(userId != req.userId) throw new ClientError(400,"userId does not match")

        const carts = req.select("carts")
        const found = carts.find(card => card.isPaid == false && card.user_id == userId )
        if( found ){

            const cart = {

                cart_id: found.cart_id,
                user_id: userId,
                product_id:productId,
                isPaid: false,
                count:1,
                createdAt: Date()
            }
            carts.push(cart)
            req.insert("carts", carts)
            res.status.json({
                cart,
                message: "The product has successfully added to Cart!"
            })
        }
		const newCart = {

			cart_id: carts.length ? carts[carts.length-1].cart_id + 1 : 1,
			user_id:userId,
			product_id:productId,
            isPaid: false,
            count: 1,
			createdAt: Date()
		}

		carts.push(newCart)
		req.insert('carts', carts)

		res.status(201).json({
			cart: newCart,
			message: "The product has successfully added to Cart!",
		})
		
	} catch(error) {
		return next(error)
	}
}

const PUT = (req, res, next)=>{

	try{

		const { userId, productId, count} = req.body
		
        if(req.userId != userId) throw new ClientError (400, "userId does not match")
        if(!productId || !count || !userId) throw new ClientError(400, "productId, count and userId  is required!")
		if (count !== 1 || count !== -1) throw new ClientError(400,"count must be 1 or -1")
		
		let carts = req.select('carts')
        const found = carts.find(card => card.isPaid == false && card.user_id == userId &&  card.product_id == productId)

        if(!found) throw new ClientError(400, "There is no such cart!")

		carts = carts.map(card => {

            if(card.isPaid == false && card.user_id == userId && card.product_id==productId){
                card.count += count
                card.updatedAt = Date()
            }
            return card
        })
        
        req.insert("carts", carts)
        return res.status(201).json({
            product: found,
            message:"The product count has been updated!"
        })
		
	

	}catch(error){
		return next(error)
	}
}

const BUY = (req, res, next) => {
    try{

        let { summa, userId} = req.body
        if (!summa || !userId ) throw new ClientError(400," summa and userId is required")
        if (userId != req.userId) throw new ClientError(400,"userId does not match")

        let carts = req.select("carts")
        let orders = req.select("orders")
        let products = req.select("products")

        let  cart = carts.filter(cart => cart.user_id == userId && cart.isPaid == false)

        if(!cart.length) throw new ClientError(400, "your cart is empty")

        cart = cart.map(cart =>{
            cart.product = products.find(product => product.product_id == cart.product_id)
            cart.isPaid = true
            return cart
        })

        let sum = cart.reduce((acc, cart) =>{
            
            return acc+cart.product.product_price
        },0)

        if(sum != summa) throw new ClientError (400,"total price and amount of products do not match")
        const newOrder = {
            order_id: orders.length ? orders[orders.length-1].order_id + 1 : 1,
            cart_id: cart[0].cart_id,
            user_id: cart[0].user_id,
            product_count : cart.length,
            totalSum:sum,
            status: 1,
            createdAt: Date()
        }
        cart.map(el=> delete el.product)
        orders.push(newOrder)
        req.insert('orders', orders)
        req.insert('carts', carts)
        
        return res.status(201).json({
            
            message:"The product is deleted in Cart!"
        })

    }catch (error){
        return next(error)
    }
}


module.exports = {
	GET,
    POST,
    PUT,
    BUY
}