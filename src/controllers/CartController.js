
const cartModel = require('../models/cart')
const productModel = require('../models/product')
const form = require('../helpers/form')

module.exports = {
	errorRoute: (_, res) => {
		res.json({
			message: 'Silahkan input id user'
		})
	},
	getCartByUserId: (req, res) => {
		const {id} = req.params

		if (typeof id == 'undefined') {
			form.errorUndefined(res)
		} else {
			cartModel
			.getCartByUserId(id)
			.then((data) => {
				form.success(res, data, 'ambil')
			}).catch((e) => {
				form.error(res, e)
			})
		}
	},
  insertProductToCart: async (req, res) => {
		const {body} = req
		const productPrice = await productModel.getProductById(body.product_id).then((data) => data[0].product_price).catch((e) => e)
		const insertBody = {
			...body,
			product_subtotal: productPrice * body.product_qty
		}

		res.json(insertBody)
	},
	deleteProductCartById: (req, res) => {
		const {id} = req.params
		
		if (typeof id == 'undefined') {
			form.errorUndefined(res)
		} else {
			cartModel
			.deleteProductCartById(id)
			.then(() => {
				form.success(res, [], 'hapus')
			}).catch((e) => {
				form.error(res, e)
			})
		}
	}
}