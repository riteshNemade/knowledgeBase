const express = require('express');
const {
    createClone
}= require('../controllers/cloneController');


const { 
    allowIfLoggedin 
} = require('../middlewares/authHandler');


const router = express.Router();

router.route("/").post(allowIfLoggedin, createClone );




module.exports=router;