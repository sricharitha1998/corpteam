const express = require('express');
const router = express.Router();
const WorkOrder = require('../controllers/workOrderController');

router.post('/insert', WorkOrder.InsertRecords);
router.get('/getRecords/:id', WorkOrder.getRecords);
router.get('/getAll', WorkOrder.getAllRecords);
router.get('/getOneRecord/:id', WorkOrder.getOneRecord);
router.post('/updateStatus', WorkOrder.UpdateStatus);
router.post('/updateVendor', WorkOrder.UpdateVendor);
router.post('/getOrderRecord', WorkOrder.getOrderRecord);

module.exports = router;