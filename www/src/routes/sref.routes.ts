import { Router } from 'express';
import {
  getAllSrefs,
  getSrefById,
  searchSrefByTag,
  addSref,
  updateSrefHandler,
  deleteSrefHandler,
} from '../controllers/sref.controller';

const router = Router();

// Get all srefs
router.get('/', getAllSrefs);

// Search srefs by tag
router.get('/search/by-tag', searchSrefByTag);

// Get sref by ID
router.get('/:id', getSrefById);

// Add new sref
router.post('/', addSref);

// Update sref
router.put('/:id', updateSrefHandler);

// Delete sref
router.delete('/:id', deleteSrefHandler);

export default router;
