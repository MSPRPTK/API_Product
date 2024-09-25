import express from 'express';
import Product from '../models/product.js';
import mongoose from 'mongoose';

const router = express.Router();

// Helper to validate ObjectId
const isValidObjectId = (id) => mongoose.isValidObjectId(id);

// CREATE a new product
router.post('/', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        return res.status(201).json(product);
    } catch (error) {
        return res.status(400).json(error);
    }
});

// READ all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json(error);
    }
});

// READ a single product by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(404).json({ message: 'Invalid ID' });
    }

    try {
        const product = await Product.findById(id);
        return product ? res.status(200).json(product) : res.status(404).json({ message: 'Product not found' });
    } catch (error) {
        return res.status(500).json(error);
    }
});

// UPDATE a product by ID
router.patch('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        return updatedProduct ? res.status(200).json(updatedProduct) : res.status(404).json({ message: 'Product not found' });
    } catch (error) {
        return res.status(400).json(error);
    }
});

// DELETE a product by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(404).json({ message: 'Invalid ID' });
    }

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        return deletedProduct ? res.status(200).json(deletedProduct) : res.status(404).json({ message: 'Product not found' });
    } catch (error) {
        return res.status(500).json(error);
    }
});

export default router;