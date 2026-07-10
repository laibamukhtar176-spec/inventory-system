const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === 'admin@test.com') {
      const token = jwt.sign({ id: 'admin123', role: 'Admin' }, process.env.JWT_SECRET || 'SUPER_SECRET_KEY_12345', { expiresIn: '1d' });
      return res.json({ token, role: 'Admin', name: 'System Admin' });
    } 
    
    if (email === 'manager@test.com') {
      const token = jwt.sign({ id: 'mgr123', role: 'Manager' }, process.env.JWT_SECRET || 'SUPER_SECRET_KEY_12345', { expiresIn: '1d' });
      return res.json({ token, role: 'Manager', name: 'Store Manager' });
    }

    return res.status(401).json({ message: 'Invalid credentials. Use admin@test.com' });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};

exports.register = async (req, res) => {
  res.status(201).json({ message: 'User registered successfully' });
};