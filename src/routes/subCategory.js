const express = require('express');
const {
    getSubCategory,
    createSubCategory,
    deleteSubCategory,
    patchSubCategory,
    getArtSubCategory,
    getEditors
}= require('../controllers/subCategoryController');


const { authorize, allowIfLoggedin } = require('../middlewares/authHandler');
const router = express.Router();

router.route("/:parentId").get(allowIfLoggedin, authorize('readAny', 'sub'), getSubCategory)
router.route("/art/:parentId").get(allowIfLoggedin, authorize('readAny', 'sub'), getArtSubCategory)
router.route("/getEditors/:parentId").get(allowIfLoggedin, authorize('readAny', 'sub'), getEditors)
router
    .route("/")
    .post(allowIfLoggedin, authorize('createAny', 'sub'), createSubCategory)
    .delete(allowIfLoggedin, authorize('deleteAny', 'sub'), deleteSubCategory)
    .patch(allowIfLoggedin, authorize('updateAny', 'sub'), patchSubCategory);



module.exports=router;