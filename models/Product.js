const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productCode: { type: String, unique: true },
  productName: { type: String, required: true },
  category: { type: String, required: true },
  supplier: { type: String, required: true },
  purchasePrice: { type: Number, required: true },
  sellingPrice: { 
    type: Number, 
    required: true,
    validate: {
      validator: function(val) { return val >= this.purchasePrice; },
      message: 'Selling Price cannot be lower than Purchase Price.'
    }
  },
  quantity: { type: Number, required: true, min: [0, 'Quantity cannot be negative'] },
  minimumStockLevel: { type: Number, required: true, default: 5 },
  productImage: { type: String, default: 'placeholder.jpg' }
});

// Auto-generate Product Code (e.g., ASE-PRD-0001)
ProductSchema.pre('save', async function(next) {
  if (!this.productCode) {
    const totalProducts = await mongoose.model('Product').countDocuments();
    const sequence = String(totalProducts + 1).padStart(4, '0');
    this.productCode = `ASE-PRD-${sequence}`;
  }
  next();
});

module.exports = mongoose.model('Product', ProductSchema);