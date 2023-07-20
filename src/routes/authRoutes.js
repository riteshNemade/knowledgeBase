const express=require('express');
const router=express.Router();
const {signUpController,signInController,forgotPwdController,resetPwdController}= require('../controllers/authController.js')

router.route('/sign-up').post(signUpController);
router.route('/sign-in').post(signInController);
router.route('/forgot-password').post(forgotPwdController);
router.route('/password-reset/:validate').post(resetPwdController);

module.exports=router;