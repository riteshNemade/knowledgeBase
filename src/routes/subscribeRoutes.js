const express = require('express');
const {
    subscribe,
    unsubscribe
}= require('../controllers/subscribeController');


const { allowIfLoggedin } = require('../middlewares/authHandler');
const router = express.Router();

router
    .route("/")
    .post(allowIfLoggedin, subscribe)
    .post(allowIfLoggedin, unsubscribe)



module.exports=router;