const express = require('express');
const router = express.Router();
const SupplyItems = require('../controllers/supplyItemsController');

router.post('/itemsInsert', SupplyItems.register)

module.exports = router;
