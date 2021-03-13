const multer = require('multer');
const path = require("path");

const form = require("../form");

const multerStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/images/products")
    },
    filename: function (req, file, callback) {
        const fieldname = file.fieldname
        const formatName = `${Date.now()}-${fieldname}${path.extname(
            file.originalname
        )}`
        callback(null, formatName)
    },
});

const upload = multer({
    storage: multerStorage
})

const uploadImages = (req, res, next) =>{
    const imageUpload = upload.array("upload_images", 5)
    imagesUpload(req, res, (err) =>{
        if(err){
            form.error(res, {
                msg :"Multer Error",
                err,
            })
        } else {
            return next()
        }
    })
}

module.exports = uploadImages