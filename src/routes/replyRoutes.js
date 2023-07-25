const express = require('express');
const {
    getReplies,
    createReply,
    patchReply,
    deleteReply

}= require('../controllers/replyController');


const { allowIfLoggedin } = require('../middlewares/authHandler');
const router = express.Router();

router.route("/").get(allowIfLoggedin, getReplies);
router
    .route("/")
    .post(allowIfLoggedin, createReply)
    .delete(allowIfLoggedin, deleteReply)
    .patch(allowIfLoggedin, patchReply);



module.exports=router;