const express = require('express');
const router = express.Router();
const SupplyItems = require('../controllers/supplyItemsController');

router.post('/itemsInsert', SupplyItems.register)
router.get('/allItems', SupplyItems.getItems)
router.post('/singleInsert', SupplyItems.singleInsert)

module.exports = router;
