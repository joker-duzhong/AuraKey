import prisma from '../utils/prisma';

export interface SrefInput {
  code: string;
  previewUrl: string;
  tags?: string[];
}

export const findAllSrefs = async () => {
  return prisma.sref.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
  });
};

export const findSrefById = async (id: string) => {
  return prisma.sref.findFirst({
    where: { id, deletedAt: null },
  });
};

export const findSrefByTag = async (tag: string) => {
  const srefs = await findAllSrefs();
  return srefs.filter((sref) =>
    sref.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))
  );
};

export const createSref = async (input: SrefInput) => {
  return prisma.sref.create({
    data: {
      code: input.code,
      previewUrl: input.previewUrl,
      tags: input.tags || [],
    },
  });
};

export const updateSref = async (id: string, input: Partial<SrefInput>) => {
  return prisma.sref.update({
    where: { id },
    data: input,
  });
};

export const deleteSref = async (id: string) => {
  return prisma.sref.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};
