const express = require('express')
const cartRouter = express.Router()

const cartContoller = require('../controllers/CartController')

cartRouter.get('/', cartContoller.errorRoute)
cartRouter.get('/:id', cartContoller.getCartByUserId)
cartRouter.post('/', cartContoller.insertProductToCart)
cartRouter.delete('/:id', cartContoller.deleteProductCartById)

module.exports = cartRouter