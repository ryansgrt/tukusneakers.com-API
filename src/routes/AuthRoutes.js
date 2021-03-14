const express = require("express");
const authRouter = express.Router();

const authController = require("../controllers/AuthController");

authRouter.get("/user/:route/:id", authController.getUser);
authRouter.post("/register/:route", authController.registerUser);
authRouter.post("/login/:route", authController.loginUser);
authRouter.post("/send_email/:route", authController.sendEmail);
authRouter.post("/forgot_pass/:route", authController.forgotPass);
authRouter.post("/verify_otp", authController.verifyOTP);
authRouter.post("/reset_pass", authController.resetPassword);
authRouter.delete("/logout", authController.logoutUser);

module.exports = authRouter;
