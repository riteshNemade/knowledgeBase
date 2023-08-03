const express = require('express');
const {
    getChildArticles, createChildArticle, deleteChildArticle, patchChildArticle, getChildren, getName
}= require('../controllers/sideBarController');


const { authorize, allowIfLoggedin } = require('../middlewares/authHandler');
const router = express.Router();

router.route("/:articleId").get(allowIfLoggedin, authorize('readAny', 'infoPage'), getChildArticles);
router.route("/child/:articleId").get(allowIfLoggedin, authorize('readAny', 'infoPage'), getChildren);
router.route("/name/:articleId").get(allowIfLoggedin, authorize('readAny', 'infoPage'), getName);
router
    .route("/")
    .post(allowIfLoggedin, authorize('createAny', 'infoPage'), createChildArticle)
    .delete(allowIfLoggedin, authorize('deleteAny', 'infoPage'), deleteChildArticle)
    .patch(allowIfLoggedin, authorize('updateAny', 'infoPage'), patchChildArticle);



module.exports=router;