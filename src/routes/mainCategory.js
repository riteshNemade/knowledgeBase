const express = require('express');
const {
    getMainCategory,
    createMainCategory,
    deleteMainCategory,
    patchMainCategory
}= require('../controllers/mainCategoryController');


const { authorize, allowIfLoggedin } = require('../middlewares/authHandler');
const router = express.Router();

router.route("/").get(allowIfLoggedin, authorize('readAny', 'main'), getMainCategory);
router
    .route("/")
    .post(allowIfLoggedin, authorize('createAny', 'main'), createMainCategory)
    .delete(allowIfLoggedin, authorize('deleteAny', 'main'), deleteMainCategory)
    .patch(allowIfLoggedin, authorize('updateAny', 'main'), patchMainCategory);



module.exports=router;