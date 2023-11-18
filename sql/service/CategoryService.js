import model from "./models.js";

class CategoryService {
    static getAllCategories = async () => {
        return await model.Category.findAll();
    }

    static getCategoryById = async (id) => {
        return await model.Category.findByPk(id);
    }

    static createCategory = async (params) => {
        const existingCategory = await model.Category.findOne({ where: { name: params.name } });
        if (existingCategory) throw new Error('Category name already exists.');
        return await model.Category.create(params);
    }

    static updateCategory = async (id, updates) => {
        const category = await model.Category.findByPk(id);
        if (!category) return null;
        return await category.update(updates);
    }

    static deleteCategory = async (id) => {
        const category = await model.Category.findByPk(id);
        if (!category) return null;
        return await category.destroy();
    }
}

export default CategoryService;

