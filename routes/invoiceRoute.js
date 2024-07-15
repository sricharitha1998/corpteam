const express = require('express');
const router = express.Router();
const Invoice = require('../controllers/invoiceController');
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/invoice/');
  },
  
  filename: (req, file, cb) => {
      cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadFields = (req, res, next) => {
  upload.any()(req, res, (err) => {
      if (err) {
          return res.status(400).send(err.message);
      }
      next();
  });
};

router.post('/register', uploadFields, Invoice.register);
router.get('/getDocuments/:id', Invoice.getDocuments);
router.post('/sendEmail', Invoice.SendEmail);
router.get('/getAll/:id', Invoice.getAllRecords);

module.exports = router;