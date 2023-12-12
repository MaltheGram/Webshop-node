import express from "express";
import InventoryService from "../service/InventoryService.js";

const router = express.Router();

const inventories = "/api/inventories/sql";

// Create an inventory
router.post(`${inventories}`, async (req, res) => {
  try {
    const inventory = await InventoryService.createInventory(req.body);
    res.status(201).json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get an inventory by id
router.get(`${inventories}/:id`, async (req, res) => {
  try {
    const inventory = await InventoryService.getInventoryById(req.params.id);
    if (!inventory)
      return res.status(404).json({ error: "Inventory item not found" });
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all inventory
router.get(`${inventories}`, async (req, res) => {
  try {
    const inventories = await InventoryService.getAllInventories();
    res.json(inventories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an inventory
router.put(`${inventories}/:id`, async (req, res) => {
  try {
    const updatedInventory = await InventoryService.updateInventory(
      req.params.id,
      req.body,
    );
    if (!updatedInventory)
      return res.status(404).json({ error: "Inventory not found" });
    res.json(updatedInventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
