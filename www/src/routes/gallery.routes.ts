import { Router } from 'express';
import {
  getAllGalleryItems,
  getGalleryItemById,
  addGalleryItem,
  updateGalleryItemHandler,
  deleteGalleryItemHandler,
  likeGalleryItemHandler,
} from '../controllers/gallery.controller';

const router = Router();

// Get all gallery items (optionally filtered by category)
router.get('/', getAllGalleryItems);

// Get gallery item by ID
router.get('/:id', getGalleryItemById);

// Add new gallery item
router.post('/', addGalleryItem);

// Update gallery item
router.put('/:id', updateGalleryItemHandler);

// Delete gallery item
router.delete('/:id', deleteGalleryItemHandler);

// Like gallery item
router.post('/:id/like', likeGalleryItemHandler);

export default router;
