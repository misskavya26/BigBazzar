const express = require('express');
const { registerUserController, loginUserController, logoutUserController, forgotPasswordController, resetPasswordController, getUserDetailController, updatePasswordController, userProfileUpdateController, getAllUserController, getSingleUserDetailController, updateUserRoleController, deleteUserController } = require('../Controller/userController');
const { authentication, authorized } = require('../middleware/auth');

const router = express.Router();

router.route('/register').post(registerUserController);
router.route('/login').post(loginUserController);
router.route('/password/forgot').post(forgotPasswordController);
router.route('/password/reset/:token').put(resetPasswordController);
router.route('/logout').get(logoutUserController);
router.route('/me').get(authentication, getUserDetailController);
router.route('/password/update').put(authentication, updatePasswordController);
router.route('/me/update').put(authentication, userProfileUpdateController);

router.route('/admin/users').get(authentication, authorized('admin'), getAllUserController);
router.route('/admin/user/:id')
    .get(authentication, authorized('admin'), getSingleUserDetailController)
    .put(authentication, authorized('admin'), updateUserRoleController)
    .delete(authentication, authorized('admin'), deleteUserController);


module.exports = router;