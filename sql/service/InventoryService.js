import model from "../models/models.js";

class InventoryService {
  // DANGER: This method should not be used, as our trigger in database will automatically create an inventory item when a product is created
  static async createInventory(params) {
    return await model.Inventory.create(params);
  }

  static async getInventoryById(id) {
    return await model.Inventory.findByPk(id);
  }

  static async getAllInventories() {
    return await model.Inventory.findAll();
  }

  static async updateInventory(id, updates) {
    const inventory = await model.Inventory.findByPk(id);
    if (!inventory) return null;
    return await inventory.update(updates);
  }
}

export default InventoryService;
