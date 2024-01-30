

const multer = require('multer');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      const uniqueCode = uuidv4().substr(0, 6);
      cb(null, `${uniqueCode}_${file.originalname}`);
    },
  });
  
  const upload = multer({ storage });
  module.exports=upload