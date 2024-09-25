import app from '../index.js';
import { use, expect } from 'chai';
import chaiHttp from 'chai-http';

const chai = use(chaiHttp);

let createdProductId;

describe('Test Product Routes', () => {

  it('should create a new product with valid JSON', async () => {
    const newProduct = {
      productName: 'Valid Product',
      stock: 20,
      detailProduct: {
        description: 'A valid product description',
        color: 'Blue',
        price: 29.99
      }
    };

    const res = await chai.request.execute(app)
      .post('/product')
      .send(newProduct);

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('productName', 'Valid Product');
    createdProductId = res.body._id;
  });

  it('should not create a product with missing required fields', async () => {
    const incompleteProduct = {
      productName: 'Incomplete Product'
      // Missing stock and detailProduct fields
    };

    const res = await chai.request.execute(app)
      .post('/product')
      .send(incompleteProduct);

    expect(res).to.have.status(400);
  });

  // Additional Test: Invalid data type for fields
  it('should return 400 when creating a product with invalid field types', async () => {
    const invalidProduct = {
      productName: 'Invalid Product',
      stock: 'not-a-number', // Invalid type for stock
      detailProduct: {
        description: 'Invalid product description',
        color: 'Red',
        price: 'not-a-number' // Invalid type for price
      }
    };

    const res = await chai.request.execute(app)
      .post('/product')
      .send(invalidProduct);

    expect(res).to.have.status(400);
  });

  it('should fetch all products', async () => {
    const res = await chai.request.execute(app)
      .get('/product');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  });

  it('should fetch a product by valid ID', async () => {
    const res = await chai.request.execute(app)
      .get(`/product/${createdProductId}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('productName', 'Valid Product');
  });

  it('should return 404 when fetching a product with a non-existent ID', async () => {
    const nonExistentId = '614c1b7d4f1a25623b123456'; // Example non-existent ID

    const res = await chai.request.execute(app)
      .get(`/product/${nonExistentId}`);

    expect(res).to.have.status(404);
  });

  it('should update the product by ID', async () => {
    const updatedProduct = { stock: 30 };

    const res = await chai.request.execute(app)
      .patch(`/product/${createdProductId}`)
      .send(updatedProduct);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('stock', 30);
  });

  // Additional Test: Updating product with invalid field types
  it('should return 400 when updating product with invalid data types', async () => {
    const invalidUpdate = { stock: 'invalidNumber' };

    const res = await chai.request.execute(app)
      .patch(`/product/${createdProductId}`)
      .send(invalidUpdate);

    expect(res).to.have.status(400);
  });

  it('should delete a product by ID', async () => {
    const res = await chai.request.execute(app)
      .delete(`/product/${createdProductId}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('productName', 'Valid Product');
  });

  it('should return 404 when deleting a non-existent product', async () => {
    const res = await chai.request.execute(app)
      .delete(`/product/${createdProductId}`);

    expect(res).to.have.status(404);
  });
});