const express = require('express');
const {
    getFeedbacks,
    createFeedback,
    patchFeedback,
    deleteFeedback

}= require('../controllers/feedbackController');


const { authorize, allowIfLoggedin } = require('../middlewares/authHandler');
const router = express.Router();

router.route("/").get(allowIfLoggedin, authorize('readAny', 'infoPage'), getFeedbacks);
router
    .route("/")
    .post(allowIfLoggedin, authorize('createAny', 'infoPage'), createFeedback)
    .delete(allowIfLoggedin, authorize('deleteAny', 'infoPage'), deleteFeedback)
    .patch(allowIfLoggedin, authorize('updateAny', 'infoPage'), patchFeedback);



module.exports=router;