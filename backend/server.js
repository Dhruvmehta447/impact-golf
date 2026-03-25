const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // This loads our secret .env file!

const app = express();

// INCREASE LIMITS: These must be right at the top!
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

// Import our new auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Import our new scores routes
const scoreRoutes = require('./routes/scores');
app.use('/api/scores', scoreRoutes);

// Import our new charity routes
const charityRoutes = require('./routes/charities');
app.use('/api/charities', charityRoutes);

// Import our new admin routes
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// Import our new draw engine routes
const drawRoutes = require('./routes/draws');
app.use('/api/draws', drawRoutes);

// Import our new payment routes
const paymentRoutes = require('./routes/payment');
app.use('/api/payment', paymentRoutes);

// Import our new claims routes
const claimRoutes = require('./routes/claims');
app.use('/api/claims', claimRoutes);

// This is the magic code that connects to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch((err) => console.log('❌ Failed to connect to MongoDB:', err));

app.get('/', (req, res) => {
  res.send('Hello from the Golf Charity Server!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});