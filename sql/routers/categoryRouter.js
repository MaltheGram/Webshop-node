import express from "express";
import CategoryService from "../service/CategoryService.js";

const router = express.Router();

const categories = "/api/categories/sql";

// Get all categories
router.get(`${categories}`, async (req, res) => {
  try {
    const categories = await CategoryService.getAllCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get a category by id
router.get(`${categories}/:id`, async (req, res) => {
  try {
    const category = await CategoryService.getCategoryById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Create a new category
router.post(`${categories}`, async (req, res) => {
  try {
    const category = await CategoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Update a category
router.put(`${categories}/:id`, async (req, res) => {
  try {
    const updatedCategory = await CategoryService.updateCategory(
      req.params.id,
      req.body,
    );
    if (!updatedCategory)
      return res.status(404).json({ error: "Category not found" });
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Delete a category
router.delete("/categories/:id", async (req, res) => {
  try {
    const result = await CategoryService.deleteCategory(req.params.id);
    if (!result) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
