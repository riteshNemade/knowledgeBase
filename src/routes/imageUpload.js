const express = require('express');
const { authorize, allowIfLoggedin } = require('../middlewares/authHandler');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationPath = path.join(__dirname, '../public/main')
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    req.body.image_name=uniqueSuffix +'-'+ file.originalname ;
    cb(null, uniqueSuffix +'-'+ file.originalname);
  },
});
const upload = multer({ storage: storage });

const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const destinationPath = path.join(__dirname, '../public/main/videos');
      cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      req.body.video_name = uniqueSuffix + '-' + file.originalname;
      cb(null, uniqueSuffix + '-' + file.originalname);
    },
  });
  const videoUpload = multer({ storage: videoStorage });



router.post(
    '/',

    upload.single('image'), 
    (req, res) => {
        try {
        
            const imageUrl = req.file.path;
            const imageName = req.body.image_name; // Extracting the filename from req.body
            
            // Send the image URL and filename back to the Quill editor
            res.json({ success: true, url: imageUrl, name: imageName });
        } catch (err) {
          console.error('Error uploading image:', err);
          res.status(500).json({ success: false, error: 'Error uploading image' });
        }
      });
router.post(
    '/video',

    videoUpload.single('video'), (req, res) => {
        try {
          const videoUrl = req.file.path;
          const videoName = req.body.video_name;
      
          // Send the video URL and filename back to the client
          res.json({ success: true, url: videoUrl, name: videoName });
        } catch (err) {
          console.error('Error uploading video:', err);
          res.status(500).json({ success: false, error: 'Error uploading video' });
        }
      });

      router.use('/video', express.static(path.join(__dirname, '../public/main/videos')));

module.exports=router;