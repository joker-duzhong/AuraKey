import { Request, Response } from 'express';
import {
  findAllArtists,
  findArtistById,
  findArtistByName,
  createArtist,
  updateArtist,
  deleteArtist,
  CreateArtistInput,
} from '../services/artist.service';

export const getAllArtists = async (req: Request, res: Response) => {
  try {
    const artists = await findAllArtists();
    res.json({
      message: 'Artists retrieved successfully',
      data: artists,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const getArtistById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const artist = await findArtistById(id);

    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    res.json({
      message: 'Artist retrieved successfully',
      data: artist,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const getArtistByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: 'Name parameter is required' });
    }

    const artist = await findArtistByName(name as string);

    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    res.json({
      message: 'Artist retrieved successfully',
      data: artist,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const addArtist = async (req: Request, res: Response) => {
  try {
    const { name, previewUrl, tags } = req.body;

    if (!name || !previewUrl) {
      return res.status(400).json({ message: 'Name and previewUrl are required' });
    }

    const existingArtist = await findArtistByName(name);
    if (existingArtist) {
      return res.status(400).json({ message: 'Artist already exists' });
    }

    const data: CreateArtistInput = {
      name,
      previewUrl,
      tags: tags || [],
    };

    const artist = await createArtist(data);
    res.status(201).json({
      message: 'Artist created successfully',
      data: artist,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const updateArtistHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const artist = await updateArtist(id, updates);
    res.json({
      message: 'Artist updated successfully',
      data: artist,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const deleteArtistHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteArtist(id);

    res.json({ message: 'Artist deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
