const express = require('express');
const router = express.Router();
const Vendor = require('../controllers/vendorController');
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/documents/');
  },
  
  filename: (req, file, cb) => {
      cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage, limits: {
    fileSize: 50 * 1024 * 1024
  } });

const uploadFields = (req, res, next) => {
  upload.any()(req, res, (err) => {
      if (err) {
          return res.status(400).send(err.message);
      }
      next();
  });
};

router.post('/register', uploadFields, Vendor.register);
router.get('/getVendorDetails/:id', Vendor.VendorDetails);
router.get('/getDetails/:vendorID', Vendor.GetDetails);
router.get('/updateProfile/:id', uploadFields, Vendor.UpdateProfile);
router.post('/updateApproval', uploadFields, Vendor.UpdateApproval);

module.exports = router;
