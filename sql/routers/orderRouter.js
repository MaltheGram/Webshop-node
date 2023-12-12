import { Router } from "express";
import OrderService from "../service/OrderService.js";

const router = Router();

const orders = "/api/orders/sql";

router.get(`${orders}`, async (req, res) => {
  const { limit } = req.query;
  let defaultLimit = 0

  limit ? defaultLimit = limit : defaultLimit = 0
  
  
  try {
    const orders = await OrderService.getAll(limit);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get an order by its ID
router.get(`${orders}/:id`, async (req, res) => {
  try {
    const order = await OrderService.getById(req.params.id);
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an order by its ID (PUT) 
// Is used to pay an order
router.put(`${orders}/:id`, async (req, res) => {
  try {
    const updatedOrder = await OrderService.update(req.params.id, req.body);
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an order by its ID
router.delete(`${orders}/:id`, async (req, res) => {
  try {
    await OrderService.delete(req.params.id);

    res.status(204).json({ message: `Deleted order ${req.params.id}}` }); // 204 No Content - indicates success but there's no content to send in the response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(`${orders}`, async (req, res) => {
  try {
    const body = req.body;
    const userId = req.body.userId;

    await OrderService.create(body, userId);

    res.status(200).json({ message: "Order created." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
