const express = require('express');
const {
    createClone
}= require('../controllers/cloneController');


const { authorize, allowIfLoggedin } = require('../middlewares/authHandler');
const { create } = require('../models/contentSchema');
const router = express.Router();

router.route("/").post(allowIfLoggedin, createClone );
// router
//     .route("/")
//     .post(allowIfLoggedin, authorize('createAny', 'infoPage'), createChildArticle)
//     .delete(allowIfLoggedin, authorize('deleteAny', 'infoPage'), deleteChildArticle)
//     .patch(allowIfLoggedin, authorize('updateAny', 'infoPage'), patchChildArticle);



module.exports=router;