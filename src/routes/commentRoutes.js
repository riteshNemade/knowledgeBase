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
    .post(allowIfLoggedin, authorize('createAny', 'infoPage'), createComment)
    .delete(allowIfLoggedin, authorize('deleteAny', 'infoPage'), deleteComment)
    .patch(allowIfLoggedin, authorize('updateAny', 'infoPage'), patchComment);



module.exports=router;