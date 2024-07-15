// routes/workClosure.js
const express = require('express');
const router = express.Router();
const workClosure = require('../controllers/workClosureController');

const multer = require("multer");
const path = require('path');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'public/documents/');
//     },
    
//     filename: (req, file, cb) => {
//       // console.log("file", file)
//       cb(null, file.originalname); 
//     },
// });

// const upload = multer({ storage: storage });

// const uploadFields = upload.fields([
//   { name: 'signup', maxCount: 1 },
//   { name: 'mrc', maxCount: 1 },
//   { name: 'nesa', maxCount: 1 },
//   { name: 'inventory', maxCount: 1 },
//   { name: 'signupABD', maxCount: 1 },
//   { name: 'officalApp', maxCount: 1 },
//   { name: 'dd', maxCount: 1 },
//   { name: 'officalDemandNote', maxCount: 1 },
//   { name: 'finalOrder', maxCount: 1 },
//   { name: 'doc', maxCount: 1 },
// ]);


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/documents/');
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

router.post('/CreateDocs', uploadFields, workClosure.CreateDocs);
router.get('/getDocuments/:id', workClosure.getDocuments);
router.post('/SendEmailVendor', workClosure.SendEmailVendor);
router.get('/getwcfs/:id', workClosure.getwcfs);
router.patch('/updateDocs/:id', uploadFields, workClosure.UpdateDocs);

module.exports = router;
