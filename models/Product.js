const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productCode: { type: String, required: true, unique: true }, // ASE-PRD-0001 format
  productName: { type: String, required: true },
  category: { type: String, required: true },
  supplier: { type: String, required: true },
  purchasePrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 },
  minimumStockLevel: { type: Number, required: true, default: 5 }
});

module.exports = mongoose.model('Product', productSchema);