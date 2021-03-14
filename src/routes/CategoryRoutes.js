const express = require('express')
const productRouter = express.Router()

const categoryController = require('../controllers/CategoryController')

productRouter.get('/', categoryController.getAllCategory)
productRouter.get('/:id', categoryController.getCategoryById)
productRouter.post('/', categoryController.insertCategory)
productRouter.patch('/:id', categoryController.updateCategory)
productRouter.delete('/:id', categoryController.deleteCategory)

module.exports = productRouter