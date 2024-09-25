import express from 'express';
import Product from '../models/product.js';
import mongoose from 'mongoose';
import amqp from 'amqplib';

const router = express.Router();

// Helper to validate ObjectId
const isValidObjectId = (id) => mongoose.isValidObjectId(id);


// Connexion à RabbitMQ
const connect = async () => {
    try {
        const connection = await amqp.connect('amqp://rabbitmq');
        const channel = await connection.createChannel();
        return channel;
    } catch (error) {
        console.error('Error connecting to RabbitMQ', error);
    }
}

// Consommer le message pour mettre à jour le stock des produits
const consumeMessage = async () => {
    try {
        const channel = await connect();
        await channel.assertQueue('product_stock');
        channel.consume('product_stock', async (msg) => {
            if (msg !== null) {
                const data = JSON.parse(msg.content.toString());
                const productId = data.productId;
                const quantity = data.quantity;
                // Mettre à jour le stock du produit
                const product = await Product.findById(productId);
                if (product) {
                    product.stock -= quantity;
                    await product.save();
                    console.log(`Stock decremented for product ${productId}`);
                }
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error('Error consuming message', error);
    }
}

// Lorsque le serveur démarre, commencez à consommer des messages
consumeMessage();

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