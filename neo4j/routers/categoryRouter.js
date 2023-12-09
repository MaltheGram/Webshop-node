import { Router } from "express";
import { createCategory } from "../service/categoryService.js";
const router = Router();

const categoriesgraph = "/api/categories/graph";

router.post(`${categoriesgraph}`, async (req, res) => {
    const {category} = req.body;
    try {
        const result = await createCategory(category);
        res.status(200).json('Category created', { result: result });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get(`${categoriesgraph}/:id`, async (req, res) => {
    try {
        const product = await getCategoryById(req.params.id);
        res.json(product);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get(`${categoriesgraph}`, async (req, res) => {
    try {
        const products = await getAllCategories();
        res.json(products);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put(`${categoriesgraph}/:id`, async (req, res) => {
    try {
        await updateCategory(req.params.id, req.body);
        res.send('Product updated successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete(`${categoriesgraph}/:id`, async (req, res) => {
    try {
        await deleteCategory(req.params.id);
        res.send('Product deleted successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});
export default router;