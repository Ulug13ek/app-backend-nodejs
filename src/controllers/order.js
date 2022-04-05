const { ClientError } = require('../utils/errors.js')
const timeConverter = require("../utils/time.js")

const GET = (req, res, next) => {

	try {
		
        const { userId } = req.body

        if(!userId) throw new ClientError(400,"userId is required!")
        if(userId != req.userId) throw new ClientError(400,"userId does not match!")

		let orders = req.select('orders')

        let order = orders.filter(order => order.user_id == userId)
        
        if(!order.length) res.json(order)

		order = order.map(card => {

			card.createdAt = timeConverter(card.createdAt)
			card.updateAt =  card.updateAt ? timeConverter(card.updateAt) : ""
			return card
		})

        return res.json(cart)
      
        
	} catch(error) {
		return next(error)
	}
}

const AGET = (req, res, next) => {

	try {
		
        const { userId } = req.params

        let orders = req.select('orders')

        if(!userId) return res.json(orders)


        let order = orders.filter(card => card.user_id == userId)
        
        if(!order.length) return res.json(order)
        
		order = order.map(card => {

			card.createdAt = timeConverter(card.createdAt)
			card.updateAt =  card.updateAt ? timeConverter(card.updateAt) : ""
			return card

		})

        return res.json(cart)
      
        
	} catch(error) {
		return next(error)
	}
}

const PUT = (req, res, next)=>{
	try{

		const { status,orderId } = req.body
		
		const orders = req.select('orders')

        if(!status || !orderId ) throw new ClientError(400, "status and orderId is required!")
		
		const order = orders.find(order =>orderId==order.order_id)
	
		if(!order) throw new ClientError (400, "order not found")

		order.status  = status

		req.insert('orders', orders)
		
		return res.status(200).json({
			order,
			message: "The order status  has successfully updated!",
		})


	}catch(error){
		return next(error)
	}
}



module.exports = {
	GET,
    AGET,
    PUT
}