import { Router } from 'express';
import {
  getAllCategories,
  getCategoryByName,
  getCategoryByIdHandler,
  addCategory,
  updateCategoryHandler,
  updateCategoryItemsHandler,
  deleteCategoryHandler,
  searchCategories,
} from '../controllers/category.controller';

const router = Router();

// Get all categories
router.get('/', getAllCategories);

// Search categories
router.get('/search', searchCategories);

// Get category by ID
router.get('/id/:id', getCategoryByIdHandler);

// Get category by name
router.get('/:name', getCategoryByName);

// Add new category
router.post('/', addCategory);

// Update category
router.put('/:id', updateCategoryHandler);

// Update subcategory items
router.put('/:id/subcategories/:subName/items', updateCategoryItemsHandler);

// Delete category
router.delete('/:id', deleteCategoryHandler);

export default router;
