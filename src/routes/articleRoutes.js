const express = require('express');
const {
    getArticle,
    createArticle,
    deleteArticle,
    patchArticle,
    incLikes,
    getLikes,
    decLikes,
    getUserLike
} = require('../controllers/articleController');


const { authorize, allowIfLoggedin } = require('../middlewares/authHandler');
const router = express.Router();

router.route("/:parentId").get(allowIfLoggedin, authorize('readAny', 'article'), getArticle);

router.route("/getLikes/:articleId").get(allowIfLoggedin, authorize('readAny', 'article'), getLikes);
router.route("/getUserLike/:articleId").get(allowIfLoggedin, authorize('readAny', 'article'), getUserLike);
router.route("/like/").post(allowIfLoggedin, authorize('readAny', 'article'), incLikes);
router.route("/dislike/").post(allowIfLoggedin, authorize('readAny', 'article'), decLikes);

router
    .route("/")
    .post(allowIfLoggedin, authorize('createAny', 'article'), createArticle)
    .delete(allowIfLoggedin, authorize('deleteAny', 'article'), deleteArticle)
    .patch(allowIfLoggedin, authorize('updateAny', 'article'), patchArticle);



module.exports = router;