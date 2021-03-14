const express = require("express");
const attrRouter = express.Router();

const attrController = require("../controllers/AttributeController");

attrRouter.get("/:attr", attrController.getDataByAttr);
attrRouter.post("/address", attrController.insertAddress);
attrRouter.get("/address/:id", attrController.getAddressByUser);
attrRouter.patch("/address/:id", attrController.updateAddress);
attrRouter.patch("/address/:id_user/:id", attrController.updateActiveAddress);
attrRouter.delete("/address/:id", attrController.deleteAddress);

module.exports = attrRouter;
