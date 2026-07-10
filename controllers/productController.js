const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const { productCode, productName, category, supplier, purchasePrice, sellingPrice, quantity } = req.body;

    // Assignment Rule: Selling Price cannot be lower than Purchase Price[cite: 1]
    if (sellingPrice < purchasePrice) {
      return res.status(400).json({ message: "Selling price cannot be lower than purchase price" });
    }

    const newProduct = new Product({ productCode, productName, category, supplier, purchasePrice, sellingPrice, quantity });
    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", newProduct });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};