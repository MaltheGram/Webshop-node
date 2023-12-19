import { Router } from "express";
import {
  changeProductCategory,
  createProductWithRelationToInventoryAndCategory,
  deleteProductAndInventory,
  getAllProducts,
  getProductsByCategoryId,
  productDetails,
  updateProductAndInventory,
} from "../../neo4j/service/productService.js";
const router = Router();

const produtcsgraph = "/api/products/graph";

router.post(`${produtcsgraph}`, async (req, res) => {
  const product = req.body.product;
  const inventory = req.body.inventory;
  const category = req.body.category;

  try {
    const result = await createProductWithRelationToInventoryAndCategory(
      product,
      inventory,
      category,
    );
    res.status(200).json({ result: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.get(`${produtcsgraph}/:id`, async (req, res) => {
  try {
    const productAndInventory = await productDetails(req.params.id);
    res.json(productAndInventory);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get(`${produtcsgraph}`, async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put(`${produtcsgraph}/:id`, async (req, res) => {
  try {
    const update = await updateProductAndInventory(
      req.params.id,
      req.body.product,
      req.body.inventory,
    );
    res.send({result: update});
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete(`${produtcsgraph}/:id`, async (req, res) => {
  try {
    await deleteProductAndInventory(req.params.id);
    res.send("Product deleted successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get(`${produtcsgraph}/category/:categoryId`, async (req, res) => {
  const categoryId = req.params.categoryId;

  try {
    const products = await getProductsByCategoryId(categoryId);
    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.put(
  `${produtcsgraph}/:productId/category/:newCategoryId`,
  async (req, res) => {
    const productId = req.params.productId;
    const newCategoryId = req.params.newCategoryId;

    try {
      const result = await changeProductCategory(productId, newCategoryId);
      res.status(200).json({ result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },
);

export default router;
