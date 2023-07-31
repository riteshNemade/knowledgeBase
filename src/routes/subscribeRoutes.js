const express = require('express');
const {
    subscribe,
    unsubscribe,
    getSub
}= require('../controllers/subscribeController');


const { allowIfLoggedin } = require('../middlewares/authHandler');
const router = express.Router();

router
    .route("/")
    .post(allowIfLoggedin, subscribe)
    .delete(allowIfLoggedin, unsubscribe)

router
    .route("/:articleId")
    .get(allowIfLoggedin, getSub)



module.exports=router;