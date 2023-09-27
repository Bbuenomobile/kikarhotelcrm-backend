const router = require('express').Router();
const adminController = require('../../controllers/auth');

router.post('/signup', adminController.Signup);

router.post('/signin', adminController.Signin);


module.exports = {
    router: router,
    basePath: '/'
};