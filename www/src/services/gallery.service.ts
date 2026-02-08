import prisma from '../utils/prisma';

export interface CreateGalleryItemInput {
  url: string;
  title: string;
  author: string;
  avatar: string;
  width: number;
  height: number;
  category: string;
  prompt: string;
  model: string;
  ratio: string;
  resolution: string;
  refImages?: string[];
}

export const findAllGalleryItems = async (category?: string) => {
  const where = category ? { category, deletedAt: null } : { deletedAt: null };
  return await prisma.galleryItem.findMany({ where });
};

export const findGalleryItemById = async (id: string) => {
  return await prisma.galleryItem.findUnique({
    where: { id },
  });
};

export const createGalleryItem = async (data: CreateGalleryItemInput) => {
  return await prisma.galleryItem.create({
    data: {
      ...data,
      refImages: data.refImages || [],
    },
  });
};

export const updateGalleryItem = async (id: string, data: Partial<CreateGalleryItemInput>) => {
  return await prisma.galleryItem.update({
    where: { id },
    data,
  });
};

export const deleteGalleryItem = async (id: string) => {
  return await prisma.galleryItem.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const likeGalleryItem = async (id: string) => {
  return await prisma.galleryItem.update({
    where: { id },
    data: { likes: { increment: 1 } },
  });
};
