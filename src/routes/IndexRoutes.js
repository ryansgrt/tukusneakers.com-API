const express = require("express");

const mainRouter = express.Router();

const welcomeRouter = require("./WelcomeRoutes");
const productRouter = require("./ProductRoutes");
const productsRouter = require("./ProductsRoutes");
const categoryRouter = require("./CategoryRoutes");
const historyRouter = require("./HistoryRoutes");
const cartRouter = require("./CartRoutes");
const attrRouter = require("./AttributeRoutes");
const authRouter = require("./AuthRoutes");
const profileRouter = require("./ProfileRoutes");

mainRouter.use("/", welcomeRouter);
mainRouter.use("/product", productRouter);
mainRouter.use("/products", productsRouter);
mainRouter.use("/category", categoryRouter);
mainRouter.use("/history", historyRouter);
mainRouter.use("/cart", cartRouter);
mainRouter.use("/attribute", attrRouter);
mainRouter.use("/auth", authRouter);
mainRouter.use("/profile", profileRouter);

module.exports = mainRouter;
