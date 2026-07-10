const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());

// Routes Middleware
app.use('/api/auth', authRoutes);

// Database Connection
mongoose.connect('mongodb://localhost:2017/inventory', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Purane code ke neeche yeh line add karein:
const productRoutes = require('./routes/product');
app.use('/api/products', productRoutes);