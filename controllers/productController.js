// Local mock data store
let products = [];

exports.createProduct = async (req, res) => {
  try {
    const { productName, category, supplier, purchasePrice, sellingPrice, quantity, minimumStockLevel } = req.body;

    // Module 2 Validations
    if (Number(sellingPrice) < Number(purchasePrice)) {
      return res.status(400).json({ message: 'Selling Price cannot be lower than Purchase Price.' });
    }
    if (Number(quantity) < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative' });
    }

    // Auto-generate Product Code (Module 2)
    const sequence = String(products.length + 1).padStart(4, '0');
    const productCode = `ASE-PRD-${sequence}`;

    const newProduct = {
      _id: `prod_${Date.now()}`,
      productCode, productName, category, supplier, 
      purchasePrice: Number(purchasePrice), 
      sellingPrice: Number(sellingPrice), 
      quantity: Number(quantity), 
      minimumStockLevel: Number(minimumStockLevel || 5),
      productImage: 'placeholder.jpg'
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.getProducts = async (req, res) => {
  res.json(products);
};

// Export raw list for order tracking linkups
exports.mockProductsStore = products;