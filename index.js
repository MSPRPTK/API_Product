import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import productRoutes from './routes/productRoute.js'
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3502;

// Middleware
app.use(cors({
    origin: '*', // Autorise toutes les origines
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
  
app.use(bodyParser.json());

// Routes
app.use('/product', productRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL || 'mongodb://mongodb:27017/db_product')
   .then(() => {
       console.log('Connected to MongoDB');
   }).catch((error) => {
       console.error('Error connecting to MongoDB', error);
   });

app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});

export default app;