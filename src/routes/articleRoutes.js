const express = require('express');
const {
    getArticle,
    createArticle,
    deleteArticle,
    patchArticle,
    incViews
}= require('../controllers/articleController');


const { authorize, allowIfLoggedin } = require('../middlewares/authHandler');
const router = express.Router();

router.route("/:parentId").get(allowIfLoggedin, authorize('readAny', 'article'), getArticle);
router.route("/views/:parentId").get(allowIfLoggedin, authorize('readAny', 'article'), incViews);
router
    .route("/")
    .post(allowIfLoggedin, authorize('createAny', 'article'), createArticle)
    .delete(allowIfLoggedin, authorize('deleteAny', 'article'), deleteArticle)
    .patch(allowIfLoggedin, authorize('updateAny', 'article'), patchArticle);



module.exports=router;