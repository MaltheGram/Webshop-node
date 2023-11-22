import { Router } from "express";
import ProductService from "../service/ProductService.js";

const router = Router();

const productsSql = "/api/products/sql";

router.get(`${productsSql}`, async (req, res) => {
    try {
        const products = await ProductService.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get(`${productsSql}/:id`, async (req, res) => {
    try {
        const product = (await ProductService.getProductById(req.params.id)) || {
            message: `No product with id ${req.params.id}`,
        };
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get(`${productsSql}/category/:categoryId`, async (req, res) => {
    try {
        const products = await ProductService.getProductsByCategoryId(req.params.categoryId);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post(`${productsSql}`, async (req, res) => {
    try {
        await ProductService.createProduct(req.body);
        res.status(200).json({ message: "Product created." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put(`${productsSql}/:id`, async (req, res) => {
    try {
        await ProductService.updateProduct(req.params.id, req.body);
        res.json({ message: `Product updated.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete(`${productsSql}/:id`, async (req, res) => {
    try {
        await ProductService.deleteProduct(req.params.id);
        res.json({ message: `Product deleted.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;