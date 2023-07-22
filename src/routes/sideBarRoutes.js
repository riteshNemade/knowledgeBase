const express = require('express');
const {
    getChildArticles, createChildArticle, deleteChildArticle, patchChildArticle
}= require('../controllers/sideBarController');


const { authorize, allowIfLoggedin } = require('../middlewares/authHandler');
const router = express.Router();

router.route("/").get(allowIfLoggedin, authorize('readAny', 'infoPage'), getChildArticles);
router
    .route("/")
    .post(allowIfLoggedin, authorize('createAny', 'infoPage'), createChildArticle)
    .delete(allowIfLoggedin, authorize('deleteAny', 'infoPage'), deleteChildArticle)
    .patch(allowIfLoggedin, authorize('updateAny', 'infoPage'), patchChildArticle);



module.exports=router;