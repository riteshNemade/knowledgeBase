const express = require('express');
const {
    getMainCategory,
    createMainCategory,
    deleteMainCategory,
    patchMainCategory
}= require('../controllers/mainCategoryController');
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



const upload = multer({ storage });

router.post(
    '/',
    allowIfLoggedin,
    authorize('createAny', 'main'),
    upload.single('image'), 
    createMainCategory
  ).patch('/',
    allowIfLoggedin, 
    authorize('updateAny', 'main'), 
    upload.single('image'), 
    patchMainCategory
    );
  
router
    .route("/")
    .get(allowIfLoggedin, authorize('readAny', 'main'), getMainCategory)
    .delete(allowIfLoggedin, authorize('deleteAny', 'main'), deleteMainCategory)



module.exports=router;