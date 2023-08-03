const express = require('express');
const {
    getComments,
    createComment,
    patchComment,
    deleteComment

}= require('../controllers/commentController');


const { authorize, allowIfLoggedin } = require('../middlewares/authHandler');
const router = express.Router();

router.route("/:parentId").get(allowIfLoggedin, authorize('readAny', 'infoPage'), getComments);
router
    .route("/")
    .post(allowIfLoggedin, createComment)
    .delete(allowIfLoggedin, deleteComment)
    .patch(allowIfLoggedin, patchComment);



module.exports=router;