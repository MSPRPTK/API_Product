const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const amqp = require('amqplib');

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
        res.status(201).send(product);
    } catch (error) {
        res.status(400).send(error);
    }
});

// READ all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send(error);
    }
});

// READ a single product by id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send();
        }
        res.status(200).send(product);
    } catch (error) {
        res.status(500).send(error);
    }
});

// UPDATE a product by id
router.patch('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).send();
        }
        res.status(200).send(product);
    } catch (error) {
        res.status(400).send(error);
    }
});

// DELETE a product by id
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).send();
        }
        res.status(200).send(product);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
