const express = require('express');
const {
    getSubCategory,
    createSubCategory,
    deleteSubCategory,
    patchSubCategory
}= require('../controllers/subCategoryController');


const { authorize, allowIfLoggedin } = require('../middlewares/authHandler');
const router = express.Router();

router.route("/:parentId").get(allowIfLoggedin, authorize('readAny', 'sub'), getSubCategory);
router
    .route("/")
    .post(allowIfLoggedin, authorize('createAny', 'sub'), createSubCategory)
    .delete(allowIfLoggedin, authorize('deleteAny', 'sub'), deleteSubCategory)
    .patch(allowIfLoggedin, authorize('updateAny', 'sub'), patchSubCategory);



module.exports=router;