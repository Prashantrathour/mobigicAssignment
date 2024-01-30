const express = require("express");
const { registerController, loginController, logoutController } = require("../controllers/user.controller");
const { auth } = require("../middleware/Auth.middleware");
const userRouter = express.Router();

userRouter.post("/register", registerController.registerUser);
userRouter.post("/login", loginController.loginUser);
userRouter.post("/logout",auth,logoutController.logoutUser);
userRouter.post("/upload",auth,logoutController.logoutUser);

module.exports = {
  userRouter
};