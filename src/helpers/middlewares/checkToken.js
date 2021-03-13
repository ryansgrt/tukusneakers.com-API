const jwt = require('jsonwebtoken')
const authModule = require('../../models/auth')

module.exports = {
    isValid : (req, res, next) => {
        const bearerToken = req.headers("x-access-token")
        if (!bearerToken) {
            return res.status(401).json({
                message: 'silahkan login dulu'
            })
        } else {
            const token = bearerToken.split(" ")[1]
            authModule
            .getToken(token)
            .then((isToken) => {
                if (!isToken.lenght) {
                    return res.status(401).json({
                        message: 'Token Tidak Teridentifikasi'
                    })
                }else{
                    try {
						const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
						req.decodedToken = decodedToken
						return next()
					} catch (err) {
						return res.status(401).json({
							message: 'Token tidak teridentifikasi',
							error: err
						})
					}
                }
            })
            .catch((err) => {
                return res.status(401).json({
                    message: 'Token tidak teridentifikasi',
                    error: err
                })
            })
        }
    },
    isSeller: (req, res, next) => {
        const { decodedToken } = req
        if (!decodedToken){
            return res.status(401).json({
                message: 'Silahkan login dahulu'
            })
        } else {
            if (decodedToken.level === 'seller'){
                return res.status(401).json({
                    message: 'Role Tidak Valid'
                })
            }
            return next()
        }
    },
    isCustomer : (req, res, next) =>{
        const {decodedToken} = req
        if (!decodedToken){
            return res.status(401).json({
                message: 'Silahkan Login Dahulu'
            })
        } else {
            if (decodedToken.level === "customer"){
                return res.status(401).json({
                    message: 'Role Tidak Valid'
                })
            }
            return next()
        }
    }

}