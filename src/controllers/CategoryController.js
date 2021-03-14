const categoryModel = require('../models/category')
const form = require('../helpers/form')

module.exports = {
	getAllCategory: (_, res) => {
		categoryModel.getAllCategory()
		.then((categories) => {
			form.success(res, categories, 'ambil')
		}).catch((e) => {
			form.error(res, e)
		})
	},
	getCategoryById: (req, res) => {
		const {id} = req.params	

		categoryModel
		.getCategoryById(id)
		.then((category) => {
			form.success(res, category, 'ambil')
		}).catch((e) => {
			form.error(res, e)
		})
	},
	insertCategory: (req, res) => {
		const {body} = req

		categoryModel
		.insertCategory(body)
		.then((data) => {
			const resObj = {
				msg: 'Data berhasil dimasukkan',
				data: {id: data.insertId, ...body}
			}
			res.json(resObj);
		}).catch((e) => {
			form.error(res, e)
		})
	},
	updateCategory: (req, res) => {
		const {params: {id}, body} = req

		categoryModel
		.updateCategory(id, body)
		.then(() => {
			const resObj = {
				msg: 'Data berhasil diupdate',
				data: body
			}
			res.json(resObj);
		}).catch((e) => {
			form.error(res, e)
		})
	},
	deleteCategory: (req, res) => {
		const {id} = req.params	

		categoryModel
		.deleteCategory(id)
		.then(() => {
			const resObj = {
				msg: 'Data berhasil dihapus',
			}
			res.json(resObj);
		}).catch((e) => {
			form.error(res, e)
		})
	}
}