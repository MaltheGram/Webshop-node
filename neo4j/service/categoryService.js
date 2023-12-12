import { createCategoryNode } from "../nodes/categoryNode.js";


const createCategory = async (category) => {
    const createCategory = await createCategoryNode(category);
  
    return createCategory;
  };

export { createCategory };


