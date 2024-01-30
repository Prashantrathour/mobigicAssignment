const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    filename: String,
    code: String,
  }, {
    timestamps: true
  })


const Filemodel = mongoose.model("file", fileSchema);

module.exports = {
    Filemodel
};
