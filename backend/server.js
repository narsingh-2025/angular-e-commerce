require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.use('/api/categories',  require('./routes/categories'));
app.use('/api/products',    require('./routes/products'));
app.use('/api/bulk-orders', require('./routes/bulkOrders'));
app.use('/api/dashboard',   require('./routes/dashboard'));
app.use('/api/reviews',     require('./routes/reviews'));
app.use('/api/farmers',     require('./routes/farmers'));
app.use('/api/orders',      require('./routes/orders'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', version: '2.0' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
