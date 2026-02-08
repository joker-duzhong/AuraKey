import prisma from '../utils/prisma';

export interface CreateArtistInput {
  name: string;
  previewUrl: string;
  tags?: string[];
}

export const findAllArtists = async () => {
  return await prisma.artist.findMany({
    where: { deletedAt: null },
  });
};

export const findArtistById = async (id: string) => {
  return await prisma.artist.findUnique({
    where: { id },
  });
};

export const findArtistByName = async (name: string) => {
  return await prisma.artist.findUnique({
    where: { name },
  });
};

export const createArtist = async (data: CreateArtistInput) => {
  return await prisma.artist.create({
    data: {
      ...data,
      tags: data.tags || [],
    },
  });
};

export const updateArtist = async (id: string, data: Partial<CreateArtistInput>) => {
  return await prisma.artist.update({
    where: { id },
    data,
  });
};

export const deleteArtist = async (id: string) => {
  return await prisma.artist.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};
