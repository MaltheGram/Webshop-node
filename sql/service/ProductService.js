import model from "../models/models.js";

class ProductService {
    constructor() {}

    static getAllProducts = async () => {
        return await model.Product.findAll();
    }

    static getProductById = async (id) => {
        return await model.Product.findByPk(id);
    }

    static getProductsByCategoryId = async (categoryId) => {
        return await model.Product.findAll({ where: { categoryId: categoryId } });
    }

    static createProduct = async (params) => {
        const transaction = await model.sequelize.transaction();
        try {
            const product = await model.Product.create(params, { transaction });
            const productId = product.id;

            const inventoryParams = {
                ...params.Inventory,
                productId: productId
            };

            await model.Inventory.create(inventoryParams, { transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    static updateProduct = async (id, updates) => {
        const product = await model.Product.findByPk(id);
        if (!product) return null;
        return await product.update(updates);
    }

    static deleteProduct = async (id) => {
        const product = await model.Product.findByPk(id);
        if (!product) return null;
        return await product.destroy();
    }
}

export default ProductService;
