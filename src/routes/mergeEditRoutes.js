const express = require('express');
const {
    getEdits

}= require('../controllers/mergeEditController');


const { authorize, allowIfLoggedin } = require('../middlewares/authHandler');
const router = express.Router();

router.route("/:articleId").get(allowIfLoggedin, authorize('readAny', 'infoPage'), getEdits);




module.exports=router;