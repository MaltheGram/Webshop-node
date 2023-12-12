import {
  createCategoryNode,
  getAllCategoriesNode,
  getCategoryByIdNode
} from "../nodes/categoryNode.js";

const createCategory = async (category) => {
  const createCategory = await createCategoryNode(category);

  return createCategory;
};

const getAllCategories = async () => {
  const getAllCategories = await getAllCategoriesNode();

  return getAllCategories;
};

const getCategoryById = async (id) => {
  const getCategoryById = await getCategoryByIdNode(id);

  return getCategoryById;
}

export { createCategory, getAllCategories, getCategoryByIdNode };
