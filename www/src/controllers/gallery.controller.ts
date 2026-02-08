import { Request, Response } from 'express';
import {
  findAllGalleryItems,
  findGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  likeGalleryItem,
  CreateGalleryItemInput,
} from '../services/gallery.service';

export const getAllGalleryItems = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const items = await findAllGalleryItems(category as string | undefined);
    res.json({
      message: 'Gallery items retrieved successfully',
      data: items,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const getGalleryItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await findGalleryItemById(id);

    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    res.json({
      message: 'Gallery item retrieved successfully',
      data: item,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const addGalleryItem = async (req: Request, res: Response) => {
  try {
    const { url, title, author, avatar, width, height, category, prompt, model, ratio, resolution, refImages } = req.body;

    if (!url || !title || !author || !avatar || !width || !height || !category || !prompt || !model || !ratio || !resolution) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const data: CreateGalleryItemInput = {
      url,
      title,
      author,
      avatar,
      width,
      height,
      category,
      prompt,
      model,
      ratio,
      resolution,
      refImages: refImages || [],
    };

    const item = await createGalleryItem(data);
    res.status(201).json({
      message: 'Gallery item created successfully',
      data: item,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const updateGalleryItemHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const item = await updateGalleryItem(id, updates);
    res.json({
      message: 'Gallery item updated successfully',
      data: item,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const deleteGalleryItemHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteGalleryItem(id);

    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const likeGalleryItemHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await likeGalleryItem(id);

    res.json({
      message: 'Gallery item liked successfully',
      data: item,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
