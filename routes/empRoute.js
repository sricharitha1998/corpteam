const express = require('express');
const router = express.Router();
const emp = require('../controllers/empController');

router.post('/registration', emp.registration)
router.get('/getEmployees', emp.getEmployees)
router.post('/login', emp.login)

module.exports = router;
