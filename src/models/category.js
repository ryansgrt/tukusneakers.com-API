const db = require('../configs/dbconnection')
const qs = require('../helpers/query')

const queryS = 'SELECT * FROM categories '

module.exports = {
	getAllCategory: () => {
		return new Promise((resolve, reject) => {
			db.query(queryS, (err, data) => {
				if(!err) {
					resolve(data)
				} else {
					reject(err)
				}
			})
		})
	},
	getCategoryById: (id) => {
		return new Promise((resolve, reject) => {
			db.query(queryS + `WHERE category_id=${id}`, (err, data) => {
				if(!err) {
					resolve(data)
				} else {
					reject(err)
				}
			})
		})
	},
	insertCategory: (body) => {
		return new Promise((resolve, reject) => {
			const queryS = `INSERT INTO categories SET ?`
			db.query(queryS, body, (err, data) => {
				if(!err) {
					resolve(data)
				} else {
					reject(err)
				}
			})
		})
	},
	updateCategory: (id, body) => {
		return new Promise((resolve, reject) => {
			const queryS = `UPDATE categories SET ? WHERE category_id=${id}`
			db.query(queryS, body, (err, data) => {
				if(!err) {
					resolve(data)
				} else {
					reject(err)
				}
			})
		})
	},
	deleteCategory: (id) => {
		return new Promise((resolve, reject) => {
			const queryS = `DELETE FROM categories WHERE category_id=${id}`
			db.query(queryS, (err, data) => {
				if(!err) {
					resolve(data)
				} else {
					reject(err)
				}
			})
		})
	}
}