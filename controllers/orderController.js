const { mockProductsStore } = require('./productController');
let orders = [];

exports.createOrder = async (req, res) => {
  try {
    const { customerName, customerEmail, orderedProducts } = req.body;
    let totalAmount = 0;

    // 1. Stock verification & Auto total calculation (Module 5)
    for (let item of orderedProducts) {
      const product = mockProductsStore.find(p => p._id === item.product || p.productCode === item.product);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      
      // NEW FIX: Prevent negative or zero quantities from being ordered!
      if (Number(item.quantity) <= 0) {
        return res.status(400).json({ message: 'Order quantity must be at least 1.' });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.productName}` });
      }
      totalAmount += product.sellingPrice * item.quantity;
    }

    // 2. Deduct inventory quantities dynamically (Module 5)
    for (let item of orderedProducts) {
      const product = mockProductsStore.find(p => p._id === item.product || p.productCode === item.product);
      product.quantity -= item.quantity;
    }

    // 3. Save Mock Order
    const order = {
      _id: `order_${Date.now()}`,
      customerName, customerEmail, orderDate: new Date(),
      orderedProducts, totalAmount, orderStatus: 'Pending'
    };
    orders.push(order);

    res.status(201).json({ message: 'Order Placed successfully', order });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.mockOrdersStore = orders;