const { ClientError } = require('../utils/errors.js')
const timeConverter = require("../utils/time.js")

const GET = (req, res, next) => {

	try {
		
        const { userId } = req.body

        if(!userId) throw new ClientError(400, "userId is required!")
		if(userId != req.userId) throw new ClientError(400, "userId does not match")

		let saveds = req.select('saved')
		saveds = saveds.map(saved => {
			saved.createdAt = timeConverter(saved.createdAt)
			saved.updateAt =  saved.updateAt ? timeConverter(saved.updateAt) : ""
			return saved
		})
        
        const saved = saveds.filter(element =>{
            if (element.user_id == userId)  return true
            return false
        })
     
        return res.json(saved)
      
        
	} catch(error) {
		return next(error)
	}
}


const POST = (req,res,next) =>{
	try {

		const saveds = req.select('saved')
		const { userId, productId } = req.body

		if(!userId || !productId) throw new ClientError(400, "userId and productId is required!")

		const newSaved = {
			saved_id: saveds.length ? saveds[saveds.length-1].saved_id +1 : 1,
			user_id:userId,
			product_id:productId,
			createdAt: Date()
		}

		saveds.push(newSaved)
		req.insert('saved', saveds)

		res.status(201).json({
			saved: newSaved,
			message: "The product has successfully added to Saved!",
		})
		
	} catch(error) {
		return next(error)
	}
}

const CHANGE = (req, res, next)=>{

	try{

		const { savedId } = req.params
		
		const saveds = req.select('saved')

        if(!savedId) throw new ClientError(400, "savedId is required!")
			
		const found = saveds.findIndex(saved => saved.saved_id == savedId)
		
		if(found == -1) {
			throw new ClientError(404, "There is no such product!")
		}
		
		const saved = saveds.splice(found, 1)

		let cards = req.select('cards')
		let card = cards.find(card => card.isPaid == false && card.user_id == saved[0].user_id)

		if(!card){

			const newCard = {
				card_id: cards.length ? cards[cards.length - 1].card_id +1 : 1,
				user_id: saved[0].user_id,
				product_id: saved[0].product_id,
				isPaid: false,
				count:1,
				createdAt: Date()
			}

			cards.push(newCard)
			req.insert("cards", cards)
			req.insert('saved', saveds)

			return res.status(201).json({
				product: newCard,
				message:"The product was added to Cards!"
			})
		}

		const addCard = {
			card_id:card.card_id,
			user_id:card.user_id,
			product_id:saved[0].product_id,
			isPaid:false,
			count:1,
			createdAt:Date()
		}

		cards.push(addCard)
		req.insert('saved', saveds)
		req.insert("cards",cards)

		return res.status(201).json({
			product: saved,
			message:"The product was added to Cards!"
		})


	}catch(error){
		return next(error)
	}
}


const DELETE = (req, res, next) => {
	try {
		let { savedId } = req.body

		if(!savedId) {
			throw new ClientError(400, "savedId is required!")
		}

		let saveds = req.select('saved')
		const found = saveds.findIndex(saved => saved.saved_id == savedId)

		if(found == -1) {
			throw new ClientError(404, "There is no such product!")
		}

		const saved = saveds.splice(found, 1)

		req.insert('saved', saveds)

		return res.status(201).json({
			product: saved,
			message:"The product is deleted!"
		})

	} catch(error) {
		return next(error)
	}
}

module.exports = {
	GET,
    	POST,
	CHANGE,
    	DELETE
}
