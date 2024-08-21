const express = require('express');
const router = express.Router();
const ServiceItems = require('../controllers/serviceItemsController');

router.post('/itemsInsert', ServiceItems.register)
router.get('/allItems', ServiceItems.getItems)

module.exports = router;
