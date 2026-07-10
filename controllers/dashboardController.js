const { mockProductsStore } = require('./productController');
const { mockOrdersStore } = require('./orderController');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalProducts = mockProductsStore.length;
    const outOfStockProducts = mockProductsStore.filter(p => p.quantity === 0).length;
    const totalOrders = mockOrdersStore.length;
    const lowStockProducts = mockProductsStore.filter(p => p.quantity > 0 && p.quantity <= p.minimumStockLevel).length;
    
    const uniqueSuppliers = [...new Set(mockProductsStore.map(p => p.supplier))];
    const totalSuppliers = uniqueSuppliers.length;

    const inventoryValue = mockProductsStore.reduce((sum, p) => sum + (p.quantity * p.purchasePrice), 0);

    res.json({ totalProducts, lowStockProducts, outOfStockProducts, totalSuppliers, totalOrders, inventoryValue });
  } catch (err) { res.status(500).json({ error: err.message }); }
};