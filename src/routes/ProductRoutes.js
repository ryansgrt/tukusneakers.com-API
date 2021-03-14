const express = require("express");
const productRouter = express.Router();

const productController = require("../controllers/ProductController");
const uploadImages = require("../helpers/middlewares/Uploads");
const token = require("../helpers/middlewares/CheckToken");

productRouter.get("/", productController.getAllProduct);
productRouter.get("/test", productController.testUrl);
productRouter.get("/:id", productController.getProductById);
// productRouter.post('/', uploadImages,  productController.insertProduct)
productRouter.post(
  "/",
  token.isValid,
  token.isSeller,
  uploadImages,
  productController.insertProduct
);
productRouter.post("/:id/:attr", productController.insertProductAttr);
productRouter.patch("/:id", uploadImages, productController.updateProduct);
productRouter.delete("/:id", productController.deleteProduct);
productRouter.delete(
  "/:productId/image/:imageId",
  productController.deleteProductImage
);

module.exports = productRouter;
