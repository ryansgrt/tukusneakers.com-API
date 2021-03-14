const mySQL = require('mysql') 

const { HOST, DB, USER, PASS } = process.env

const db = mySQL.createConnection({
	// Setting DB
	host: HOST,
	user: USER,
	password: PASS,
	database: DB,
})

db.connect((err) => {
	if (err) throw err
	console.log('Database Connect')
})

module.exports = db