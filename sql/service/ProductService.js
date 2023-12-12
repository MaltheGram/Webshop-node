import model from "../models/models.js";

class ProductService {
  constructor() {}

  static getAllProducts = async (limit) => {
    return await model.Product.findAll({
      limit: Number(limit),
    });
  };

  static getProductById = async (id) => {
    return await model.Product.findByPk(id);
  };

  static getProductsByCategoryId = async (categoryId) => {
    return await model.Product.findAll({ where: { categoryId: categoryId } });
  };

  static createProduct = async (params) => {
    try {
      const product = await model.Product.create(params);
    } catch (error) {
      throw error;
    }
  };

  static updateProduct = async (id, updates) => {
    const product = await model.Product.findByPk(id);
    if (!product) return null;
    return await product.update(updates);
  };

  static deleteProduct = async (id) => {
    const product = await model.Product.findByPk(id);
    if (!product) return null;
    return await product.update({
        isDeleted: true,
    });
  };
}

export default ProductService;
