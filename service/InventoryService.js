import model from "./models.js";

class InventoryService {
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
