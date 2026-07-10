const express = require('express');
const { createProduct, getProducts } = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

router.route('/')
  .get(protect, getProducts)
  .post(protect, authorizeRoles('Admin', 'Manager'), createProduct);

module.exports = router;