import { Router } from 'express';
import {
  getAllCategories,
  getCategoryByName,
  addCategory,
  updateCategoryHandler,
  deleteCategoryHandler,
  searchCategories,
} from '../controllers/category.controller';

const router = Router();

// Get all categories
router.get('/', getAllCategories);

// Search categories by phrase keyword
router.get('/search/phrases', searchCategories);

// Get category by name
router.get('/:name', getCategoryByName);

// Add new category
router.post('/', addCategory);

// Update category
router.put('/:id', updateCategoryHandler);

// Delete category
router.delete('/:id', deleteCategoryHandler);

export default router;
