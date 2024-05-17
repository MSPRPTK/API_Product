const mongoose = require('mongoose');

const detailProductSchema = new mongoose.Schema({
    description: String,
    color: String,
    price: Number
});

const productSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    creationDate: { type: Date, default: Date.now },
    productName: { type: String, required: true },
    stock: { type: Number, required: true },
    detailProduct: detailProductSchema
});

productSchema.pre('save', async function(next) {
    const product = this;
    if (!product.isNew) {
        return next();
    }

    try {
        const lastProduct = await Product.findOne({}, {}, { sort: { 'id': -1 } });
        if (lastProduct) {
            product.id = lastProduct.id + 1;
        } else {
            product.id = 1;
        }
        next();
    } catch (error) {
        next(error);
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
