const productsModel = require('../models/ProductsModel')
const form = require('../helpers/Form')

module.exports = {
	getAllProducts : (req, res) => {
		productsModel
		.getAllProducts(req.query)
		.then((data) => {
			productsModel.updatePropertyProduct(data)
			.then((products) => {
				form.success(res, products, 'ambil')
			}).catch((e) => {
				form.error(res, e)
			})
		})
		.catch((e) => {
			form.error(res, e)
		})
	},
}