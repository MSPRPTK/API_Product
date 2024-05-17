const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoute');

const app = express();
const port = process.env.PORT || 5000;



app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/product', productRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/db_product')
   .then(() => {
       console.log('Connected to MongoDB');
   }).catch((error) => {
       console.error('Error connecting to MongoDB', error);
   });
