const express = require('express');
const {
    createEditor,
    getEditors,
}= require('../controllers/editorController');


const { allowIfLoggedin } = require('../middlewares/authHandler');
const router = express.Router();

router
    .route("/")
    .post(allowIfLoggedin, createEditor)
  





module.exports=router;