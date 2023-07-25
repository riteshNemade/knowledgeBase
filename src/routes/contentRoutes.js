const express = require('express');
const {
    getContent,
    createContent,
    patchContent,
    deleteContent

}= require('../controllers/contentController');


const { authorize, allowIfLoggedin } = require('../middlewares/authHandler');
const router = express.Router();

router.route("/").get(allowIfLoggedin, authorize('readAny', 'infoPage'), getContent);
router
    .route("/")
    .post(allowIfLoggedin, authorize('createAny', 'infoPage'), createContent)
    .delete(allowIfLoggedin, authorize('deleteAny', 'infoPage'), deleteContent)
    .patch(allowIfLoggedin, authorize('updateAny', 'infoPage'), patchContent);



module.exports=router;