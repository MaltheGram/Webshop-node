import { ProductModel } from "../models/models.js"
class ProductService {
  static async findProductById(productId) {
    return await ProductModel.findOne({ _id: productId });
  }

  static async updateProductStock(productId, quantity) {
    const product = await ProductModel.findProductById(productId);
    if (!product) throw new Error(`Product with ID ${productId} not found`);
    if (product.quantityInStock < quantity)
      throw new Error(`Not enough stock for product ID ${productId}`);
    product.quantityInStock -= quantity;
    await product.save();
  }
}

export default ProductService;
