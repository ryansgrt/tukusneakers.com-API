const multer = require("multer");
const path = require("path");

const form = require("../form");

const multerStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/images/profile");
  },
  filename: function (req, file, callback) {
    const formatName = `${Date.now()}-${file.fieldname}${path.extname(
      file.originalname
    )}`;
    callback(null, formatName);
  },
});

const upload = multer({
  storage: multerStorage,
});

const uploadImages = (req, res, next) => {
  const imagesUpload = upload.single("photo");
  imagesUpload(req, res, (err) => {
    if (err) {
      form.error(res, {
        msg: "Multer Error",
        err,
      });
    } else {
      return next();
    }
  });
};

module.exports = uploadImages;
