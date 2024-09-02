const express = require('express');
const router = express.Router();
const order = require('../controllers/orderController');

router.post('/add', order.Add)
router.get('/getAll', order.getItems)

module.exports = router;
