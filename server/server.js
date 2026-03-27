const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const jobRoutes = require('./routes/jobRoutes');
const customerRoutes = require('./routes/customerRoutes');

dotenv.config();

// connectDB(); // Ensure MongoDB URI is in .env before uncommenting

const app = express();

app.use(express.json());

app.use('/api/jobs', jobRoutes);
app.use('/api/customers', customerRoutes);

app.get('/', (req, res) => {
  res.send('API is running....');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
