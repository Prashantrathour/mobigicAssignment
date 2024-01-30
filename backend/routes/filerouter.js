const express = require("express");

const { auth } = require("../middleware/Auth.middleware");
const { filecontrollers } = require("../controllers/filecontrollers");
const upload = require("../middleware/multer");
const fileRouter = express.Router();

fileRouter.post("/upload",auth,upload.single('file'),auth,filecontrollers.upload);
fileRouter.get("/",auth,filecontrollers.getfilesByUserId);

fileRouter.get("/download/:code",auth,filecontrollers.downloadFilesBycode);
fileRouter.delete("/delete/:fileId",auth,filecontrollers.deleteFileByFileid);

module.exports = {
  fileRouter
};