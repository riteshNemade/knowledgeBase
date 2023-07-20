const asyncHandler = require("express-async-handler");
const customError = require("../utils/customError");
const { signUp, signIn, findByEmail, resetPwd, forgotPwd } = require("../services/authService");

/****************************************Sign Up************************************************************/
const signUpController = asyncHandler(async function (req, res) {
    if (!req.body.username || !req.body.password || !req.body.email)
        throw new customError('Provide proper credentials', 400);

    res.status(200).json(await signUp(req.body));
});

/************************************** Sign In*******************************************************/

const signInController = asyncHandler(async function (req, res) {
    if (!req.body.username || !req.body.password)
        throw new customError('Provide proper credentials', 400);
    else
        res.status(200).json(await signIn(req.body))
})

/****************************************Forgot & Reset Password**************************************/
const forgotPwdController = asyncHandler(async function (req, res) {
    const { email } = req.body;
    if (!email)
        throw new customError('Please provide email.', 400)

    await findByEmail(email, (err) => {
        if (err) {
            throw new customError(err.message, 409);
        }
    })
    res.status(200).json(await forgotPwd(email));
})

const resetPwdController = asyncHandler(async function (req, res) {
    const token = req.params.validate;
    const confirmPassword = req.body.confirmPassword;
    const newPassword = req.body.newPassword;
    if(newPassword!==confirmPassword)
        return res.status(400).json({"message":"Passwords do not match."});
    
    const result = await resetPwd(token, newPassword);
    res.status(200).json(result);
})

module.exports = {
    signUpController,
    signInController,
    forgotPwdController,
    resetPwdController
};
