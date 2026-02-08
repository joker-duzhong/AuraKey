import { Router } from 'express';
import {
  getAllArtists,
  getArtistById,
  getArtistByName,
  addArtist,
  updateArtistHandler,
  deleteArtistHandler,
} from '../controllers/artist.controller';

const router = Router();

// Get all artists
router.get('/', getAllArtists);

// Search artist by name
router.get('/search/by-name', getArtistByName);

// Get artist by ID
router.get('/:id', getArtistById);

// Add new artist
router.post('/', addArtist);

// Update artist
router.put('/:id', updateArtistHandler);

// Delete artist
router.delete('/:id', deleteArtistHandler);

export default router;
