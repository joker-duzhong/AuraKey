import prisma from '../utils/prisma';

export interface SubCategory {
  name: string;
  phrases: string[];
}

export interface CategoryInput {
  mainCategory: string;
  subCategories: SubCategory[];
}

export const findAllCategories = async () => {
  return prisma.category.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
  });
};

export const findCategoryByName = async (mainCategory: string) => {
  return prisma.category.findFirst({
    where: { mainCategory, deletedAt: null },
  });
};

export const createCategory = async (input: CategoryInput) => {
  return prisma.category.create({
    data: {
      mainCategory: input.mainCategory,
      subCategories: input.subCategories,
    },
  });
};

export const updateCategory = async (id: string, input: Partial<CategoryInput>) => {
  return prisma.category.update({
    where: { id },
    data: input,
  });
};

export const deleteCategory = async (id: string) => {
  return prisma.category.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const searchCategoriesByPhrase = async (keyword: string) => {
  const categories = await findAllCategories();
  
  return categories.filter((cat) => {
    const subs = cat.subCategories as SubCategory[];
    return subs.some((sub) =>
      sub.phrases.some((phrase) =>
        phrase.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  });
};
