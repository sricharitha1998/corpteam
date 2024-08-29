const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');

router.post('/login', user.login)
router.post('/registration', user.registration)
router.get('/getUsers/:role', user.getUsers)
router.post('/sendOTP', user.SendOTP)
router.post('/changePassword', user.changePassword)
router.post('/changeProfile/:id', user.changeProfile)
router.get('/getById/:id', user.getById)

module.exports = router;
