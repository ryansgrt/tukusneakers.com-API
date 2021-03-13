const dbconnection = require('mysql')

const {HOST, DB_NAME, USER, PASSWORD} = process.env

const db = dbconnection.createConnection({
    // Databases Configuration
    host : HOST,
    user : USER,
    password : PASSWORD,
    databaseName : DB_NAME,
})

db.connect((err =>{
    if(err) throw err
    console.log('Database Connected');
}))

module.exports = db