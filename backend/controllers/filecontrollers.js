const fs=require("fs");
const { Filemodel } = require("../model/fileUpload.model");
const { createWriteStream, existsSync,createReadStream ,unlinkAsync} = require('fs');
const fileSaver = require('file-saver');
const mimeTypes = require('mime-types');
const filecontrollers={
    upload:async(req,res)=>{
        const { userId } = req.body; 
        const { filename } = req.file;
        const uniqueCode = filename.split('_')[0];
        console.log(userId)
      try {
        
          const newFile = new Filemodel({ userId, filename, code: uniqueCode });
          await newFile.save();
          res.json({msg:'File uploaded successfully.',code:uniqueCode});
        } catch (error) {
          res.status(404).json({msg:'Error on uploading file: ' + error});
        
      }
    },
    getfilesByUserId:async(req,res)=>{
        try {
            const { userId } = req.body;
            const files = await Filemodel.find({ userId });
            res.json(files);
          } catch (error) {
            console.error(error);
            res.status(500).json({msg:'Internal Server Error'});
          }
    },
  
    downloadFilesBycode:async(req,res)=>{
     
        try {
          const { code } = req.params;
          const getFile = await Filemodel.findOne({ code });
      
          if (!getFile) {
            return res.status(404).json({msg:'File not found.'});
          }
      
          const filePath = `./uploads/${getFile.filename}`;
      
          if (existsSync(filePath)) {
            const contentType = mimeTypes.lookup(filePath) || 'application/octet-stream';
            res.setHeader('Content-Disposition', `attachment; filename=${getFile.filename}`);
            res.setHeader('Content-Type', contentType);
            const fileStream = createReadStream(filePath);
            fileStream.pipe(res);
      
            fileStream.on('error', (error) => {
              console.error('Error reading file:', error);
              res.status(500).json({msg:'Internal Server Error'});
            });
          } else {
            res.status(404).json({msg:'File not found.'});
          }
        } catch (error) {
          console.error('Error downloading file:', error);
          res.status(500).json({msg:'Internal Server Error'});
        }
      
        

    },
    deleteFileByFileid: async (req, res) => {
      try {
        const { fileId } = req.params;
        const file = await Filemodel.findByIdAndDelete(fileId);
    
        if (!file) {
          return res.status(404).json({ msg: 'File not found.' });
        }
    
        const filePath = `./uploads/${file.filename}`;
    console.log(filePath)
        if (fs.existsSync(filePath)) {
          await new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
              if (err) reject(err);
              else resolve();
            });
          }); // Delete the file from the file system
        }
    
        res.json({ msg: 'File removed successfully.', data: file });
      } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal Server Error' });
      }
    }
}

module.exports={filecontrollers}