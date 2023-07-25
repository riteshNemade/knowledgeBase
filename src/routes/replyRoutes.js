const express = require('express');
const {
    getReplies,
    createReply,
    patchReply,
    deleteReply

}= require('../controllers/replyController');


const { authorize, allowIfLoggedin } = require('../middlewares/authHandler');
const router = express.Router();

router.route("/").get(allowIfLoggedin, authorize('readAny', 'infoPage'), getReplies);
router
    .route("/")
    .post(allowIfLoggedin, authorize('createAny', 'infoPage'), createReply)
    .delete(allowIfLoggedin, authorize('deleteAny', 'infoPage'), deleteReply)
    .patch(allowIfLoggedin, authorize('updateAny', 'infoPage'), patchReply);



module.exports=router;