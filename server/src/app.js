const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const jobRoutes = require('./routes/job.routes');
const mechanicRoutes = require('./routes/mechanic.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Server is running!' });
});

// API Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/mechanics', mechanicRoutes);
app.use('/api/analytics', analyticsRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app; // ONLY export the app here