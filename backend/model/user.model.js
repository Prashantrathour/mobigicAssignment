const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
   
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
    },
   
    password: {
        type: String,
        required: true,
        trim: true
       
    }, 
}, {
    timestamps: true
  });



const UserModel = mongoose.model("user", userSchema);

module.exports = {
    UserModel
};
