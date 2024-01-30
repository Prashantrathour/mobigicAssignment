const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user.model");

const registerController = {
  registerUser: async (req, res) => {
    const {  username, password } = req.body;

    try {
      let userExist = await UserModel.findOne({ username });

      if (userExist) {
        return res.status(400).json({
          msg: "username already exists, please login or signup with another username",
          state: true,
        });
      }

      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }


        const user = new UserModel({
        
          username,
        
         
          password: hash,
        });

        try {
          await user.save();
          res.json({ msg: "New user registered" });
        } catch (saveError) {
          if (saveError.code === 11000) {
            return res.status(400).json({
              msg: "username is already registered. Please use a different username.",
            });
          }
          console.log(saveError);
          return res.status(500).json({ msg: "Internal server error" });
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal server error" });
    }
  },
};

const loginController = {
  loginUser: async (req, res) => {
    let { username, password } = req.body;
username=username.toLowerCase()
    if (username && password) {
      try {
        const user = await UserModel.findOne({ username });
        if (user) {
          bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
              // Generate access token with expiry time
              const accessToken = jwt.sign(
                { userId: user._id},
                process.env.secret,
                { expiresIn: "10h" } //expire after 10 hours
              );

              // Generate refresh token
              const refreshToken = jwt.sign(
                { userId: user._id },
                process.env.refreshSecret,
                { expiresIn: "7d" } // Set the expiry time for refresh token, e.g., 7 days
              );

              // Set the refresh token as an HttpOnly cookie with expiration
              res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
              });

              // Set the access token as an HttpOnly cookie with expiration
              res.cookie("accessToken", accessToken, {
                httpOnly: true,
                maxAge: 1 * 60 * 60 * 1000, // 1 hour in milliseconds
              });

              // Send the access token and user details in the response
              token=accessToken
              res.status(200).json({
                msg: "Logged In!",
                token,
                refreshToken,
                user: user.userId,
              });
            } else {
              res.status(400).json({ msg: "Wrong Credentials" });
            }
          });
        } else {
          res.status(400).json({
            msg: "User does not exist. Please Register first",
            newuser: true,
          });
        }
      } catch (err) {
        res.status(400).json({ msg: err.message });
      }
    } else {
      res
        .status(404)
        .json({ msg: `Please enter - ${!username ? "username" : "password"}` });
    }
  },
};

const logoutController = {
  logoutUser: (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ msg: "Logged out successfully" });
  },
};

module.exports = {
  registerController,
  loginController,
  logoutController,
};
