import { Router } from "express";
import { ProductModel, validateProduct } from "../models/models.js";

const router = Router();

const productsMongo = "/api/products/mongo";

// Get all products by category
router.get(`${productsMongo}/category/:category`, async (req, res) => {
    const category = req.params.category;
  
    try {
      const products = await ProductModel.find({ category: category });
      if (products.length === 0) {
        return res.status(404).send({ message: `No products found in category: ${category}` });
      }
      res.status(200).json({ data: products });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
// Create a new product
router.post(`${productsMongo}`, async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) {
    return res.status(400).send({ validationError: error.details[0].message });
  }

  try {
    const product = new ProductModel(req.body);
    await product.save();
    res.status(201).send({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all products
router.get(`${productsMongo}`, async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json({ data: products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single product by ID
router.get(`${productsMongo}/:id`, async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.status(200).json({ data: product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a product by ID
router.put(`${productsMongo}/:id`, async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) {
    return res.status(400).send({ validationError: error.details[0].message });
  }

  try {
    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.status(200).json({ data: product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a product by ID
router.delete(`${productsMongo}/:id`, async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
