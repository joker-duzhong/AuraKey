import { Request, Response } from 'express';
import {
  findAllCategories,
  findCategoryByName,
  createCategory,
  updateCategory,
  deleteCategory,
  searchCategoriesByPhrase,
  CategoryInput,
} from '../services/category.service';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await findAllCategories();
    res.json({
      message: 'Categories retrieved successfully',
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const getCategoryByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const category = await findCategoryByName(decodeURIComponent(name));

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({
      message: 'Category retrieved successfully',
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const addCategory = async (req: Request, res: Response) => {
  try {
    const { mainCategory, subCategories } = req.body;

    if (!mainCategory || !subCategories || !Array.isArray(subCategories)) {
      return res.status(400).json({ message: 'Missing or invalid required fields' });
    }

    const data: CategoryInput = {
      mainCategory,
      subCategories,
    };

    const category = await createCategory(data);
    res.status(201).json({
      message: 'Category created successfully',
      data: category,
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Category already exists' });
    }
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const updateCategoryHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const category = await updateCategory(id, updates);
    res.json({
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const deleteCategoryHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteCategory(id);

    res.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const searchCategories = async (req: Request, res: Response) => {
  try {
    const { keyword } = req.query;

    if (!keyword || typeof keyword !== 'string') {
      return res.status(400).json({ message: 'Keyword is required' });
    }

    const results = await searchCategoriesByPhrase(keyword);
    res.json({
      message: 'Categories search completed',
      data: results,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
