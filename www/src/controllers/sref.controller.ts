import { Request, Response } from 'express';
import {
  findAllSrefs,
  findSrefById,
  findSrefByTag,
  createSref,
  updateSref,
  deleteSref,
  SrefInput,
} from '../services/sref.service';

export const getAllSrefs = async (req: Request, res: Response) => {
  try {
    const srefs = await findAllSrefs();
    res.json({
      message: 'Srefs retrieved successfully',
      data: srefs,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const getSrefById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sref = await findSrefById(id);

    if (!sref) {
      return res.status(404).json({ message: 'Sref not found' });
    }

    res.json({
      message: 'Sref retrieved successfully',
      data: sref,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const searchSrefByTag = async (req: Request, res: Response) => {
  try {
    const { tag } = req.query;

    if (!tag || typeof tag !== 'string') {
      return res.status(400).json({ message: 'Tag is required' });
    }

    const srefs = await findSrefByTag(tag);
    res.json({
      message: 'Srefs search by tag completed',
      data: srefs,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const addSref = async (req: Request, res: Response) => {
  try {
    const { code, previewUrl, tags } = req.body;

    if (!code || !previewUrl) {
      return res.status(400).json({ message: 'Missing required fields: code, previewUrl' });
    }

    const data: SrefInput = {
      code,
      previewUrl,
      tags: tags || [],
    };

    const sref = await createSref(data);
    res.status(201).json({
      message: 'Sref created successfully',
      data: sref,
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Sref code already exists' });
    }
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const updateSrefHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const sref = await updateSref(id, updates);
    res.json({
      message: 'Sref updated successfully',
      data: sref,
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Sref not found' });
    }
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const deleteSrefHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteSref(id);

    res.json({ message: 'Sref deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Sref not found' });
    }
    res.status(500).json({ message: 'Internal server error', error });
  }
};
