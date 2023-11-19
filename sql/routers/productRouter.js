import express, { Router } from "express";
import ProductService from "../service/ProductService.js";

const router = Router();

// Get all products
router.get('/products', async (req, res) => {
    try {
        const products = await ProductService.getAllProducts();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get product by id
router.get('/products/:id', async (req, res) => {
    try {
        const product = await ProductService.getProductById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get products by categoryId
router.get('/products/category/:categoryId', async (req, res) => {
    try {
        const products = await ProductService.getProductsByCategoryId(req.params.categoryId);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new product
router.post('/products', async (req, res) => {
    try {
        const product = await ProductService.createProduct(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a product
router.put('/products/:id', async (req, res) => {
    try {
        const updatedProduct = await ProductService.updateProduct(req.params.id, req.body);
        if (!updatedProduct) return res.status(404).json({ error: "Product not found" });
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a product
router.delete('/products/:id', async (req, res) => {
    try {
        const result = await ProductService.deleteProduct(req.params.id);
        if (!result) return res.status(404).json({ error: "Product not found" });
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
