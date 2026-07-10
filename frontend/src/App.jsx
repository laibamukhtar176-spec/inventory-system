import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function App() {
  // Authentication State
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Dashboard Stats State
  const [stats, setStats] = useState({
    totalProducts: 0, lowStockProducts: 0, outOfStockProducts: 0,
    totalSuppliers: 0, totalOrders: 0, inventoryValue: 0
  });

  // Product Management Form State
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [supplier, setSupplier] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  // Order Management Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [orderProduct, setOrderProduct] = useState('');
  const [orderQty, setOrderQty] = useState('');

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  // ADD THIS BLOCK BELOW IT:
  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const resStats = await axios.get(`${API_URL}/dashboard`, config);
      setStats(resStats.data);
      const resProds = await axios.get(`${API_URL}/products`, config);
      setProducts(resProds.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      setToken(res.data.token);
      setRole(res.data.role);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken('');
    setRole('');
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`${API_URL}/products`, {
        productName, category, supplier,
        purchasePrice: Number(purchasePrice),
        sellingPrice: Number(sellingPrice),
        quantity: Number(quantity)
      }, config);
      
      // Reset form
      setProductName(''); setCategory(''); setSupplier('');
      setPurchasePrice(''); setSellingPrice(''); setQuantity('');
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`${API_URL}/orders`, {
        customerName, customerEmail,
        orderedProducts: [{ product: orderProduct, quantity: Number(orderQty) }]
      }, config);

      setCustomerName(''); setCustomerEmail(''); setOrderProduct(''); setOrderQty('');
      fetchDashboardData();
      alert('Order placed successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    }
  };

  // 1. LOGIN VIEW IF NOT AUTHENTICATED
  if (!token) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'sans-serif' }}>
        <h2>Allied Software Engineers - Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '10px' }}>
            <label>Email (Use admin@test.com or manager@test.com):</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Password:</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          </div>
          <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Login</button>
        </form>
      </div>
    );
  }

  // 2. MAIN APPLICATION WORKSPACE
  return (
    <div style={{ display: 'flex', fontFamily: 'sans-serif', minHeight: '100vh' }}>
      {/* Sidebar Component */}
      <div style={{ width: '250px', background: '#2c3e50', color: 'white', padding: '20px' }}>
        <h3>ASE Inventory</h3>
        <p><strong>Role:</strong> {role}</p>
        <hr />
        <button onClick={handleLogout} style={{ width: '100%', padding: '8px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }}>Logout</button>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '20px', background: '#f8f9fa' }}>
        <h2>Enterprise Inventory Management Dashboard</h2>
        {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}

        {/* Dashboard Cards (Module 3 Stats) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          <div style={{ background: 'white', padding: '15px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><h4>Total Products</h4><h3>{stats.totalProducts}</h3></div>
          <div style={{ background: 'white', padding: '15px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '5px solid #f39c12' }}><h4>Low Stock</h4><h3>{stats.lowStockProducts}</h3></div>
          <div style={{ background: 'white', padding: '15px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '5px solid #e74c3c' }}><h4>Out of Stock</h4><h3>{stats.outOfStockProducts}</h3></div>
          <div style={{ background: 'white', padding: '15px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><h4>Suppliers</h4><h3>{stats.totalSuppliers}</h3></div>
          <div style={{ background: 'white', padding: '15px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><h4>Total Orders</h4><h3>{stats.totalOrders}</h3></div>
          <div style={{ background: 'white', padding: '15px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><h4>Inventory Value</h4><h3>${stats.inventoryValue}</h3></div>
        </div>

        {/* Dynamic Entry Panels */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          {/* Module 2: Add Product (Restricted to Admin/Manager) */}
          {(role === 'Admin' || role === 'Manager') ? (
            <div style={{ flex: 1, background: 'white', padding: '20px', borderRadius: '6px' }}>
              <h3>Add Product</h3>
              <form onSubmit={handleAddProduct}>
                <input type="text" placeholder="Product Name" value={productName} onChange={e => setProductName(e.target.value)} required style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
                <input type="text" placeholder="Category" value={category} onChange={e => setCategory} onChange={e => setCategory(e.target.value)} required style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
                <input type="text" placeholder="Supplier" value={supplier} onChange={e => setSupplier(e.target.value)} required style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
                <input type="number" placeholder="Purchase Price" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} required style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
                <input type="number" placeholder="Selling Price" value={sellingPrice} onChange={e => setSellingPrice(e.target.value)} required style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
                <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} required style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
                <button type="submit" style={{ padding: '10px 20px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save Product</button>
              </form>
            </div>
          ) : (
            <div style={{ flex: 1, background: '#eee', padding: '20px', borderRadius: '6px' }}>
              <p><em>Notice: Product creation tools are locked for Employee accounts.</em></p>
            </div>
          )}

          {/* Module 4: Order Desk Panel */}
          <div style={{ flex: 1, background: 'white', padding: '20px', borderRadius: '6px' }}>
            <h3>Create Customer Order</h3>
            <form onSubmit={handlePlaceOrder}>
              <input type="text" placeholder="Customer Name" value={customerName} onChange={e => setCustomerName(e.target.value)} required style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
              <input type="email" placeholder="Customer Email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} required style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
              
              <select value={orderProduct} onChange={e => setOrderProduct(e.target.value)} required style={{ width: '100%', padding: '8px', marginBottom: '10px' }}>
                <option value="">Select Product...</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>{p.productName} ({p.productCode}) - Stock: {p.quantity}</option>
                ))}
              </select>

              <input type="number" placeholder="Order Quantity" value={orderQty} onChange={e => setOrderQty(e.target.value)} required style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
              <button type="submit" style={{ padding: '10px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Submit Order</button>
            </form>
          </div>
        </div>

        {/* Product Catalogue Table View */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '6px' }}>
          <h3>Master Product Stocklist</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ background: '#f1f2f6', textAlign: 'left' }}>
                <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Code</th>
                <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Name</th>
                <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Category</th>
                <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Stock Level</th>
                <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Status Alert</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}><code>{p.productCode}</code></td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{p.productName}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{p.category}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{p.quantity} units</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                    {p.quantity === 0 ? (
                      <span style={{ color: 'red', fontWeight: 'bold' }}>⚠️ OUT OF STOCK</span>
                    ) : p.quantity <= p.minimumStockLevel ? (
                      <span style={{ color: 'orange', fontWeight: 'bold' }}>⚠️ LOW STOCK WARNING</span>
                    ) : (
                      <span style={{ color: 'green' }}>Good</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}