import prisma from '../utils/prisma';

export const findUserByEmail = async (email: string) => {
  return prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
    },
  });
};

export const findUserById = async (id: number) => {
  return prisma.user.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });
};

export const softDeleteUser = async (id: number) => {
  return prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};
