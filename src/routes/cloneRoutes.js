const express = require('express');
const {
    createClone
}= require('../controllers/cloneController');


const { authorize, allowIfLoggedin } = require('../middlewares/authHandler');
const { create } = require('../models/contentSchema');
const router = express.Router();

router.route("/").post(allowIfLoggedin, createClone );




module.exports=router;