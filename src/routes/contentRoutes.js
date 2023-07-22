const express = require('express');
const {
    getInfoPage,
    createInfoPage,
    deleteInfoPage,
    patchInfoPage
}= require('../controllers/sideBarController');


const { authorize, allowIfLoggedin } = require('../middlewares/authHandler');
const router = express.Router();

router.route("/").get(allowIfLoggedin, authorize('readAny', 'infoPage'), getInfoPage);
router
    .route("/")
    .post(allowIfLoggedin, authorize('createAny', 'infoPage'), createInfoPage)
    .delete(allowIfLoggedin, authorize('deleteAny', 'infoPage'), deleteInfoPage)
    .patch(allowIfLoggedin, authorize('updateAny', 'infoPage'), patchInfoPage);



module.exports=router;