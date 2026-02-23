import prisma from '../utils/prisma';

export interface PhraseItem {
  id: string;
  name: string;
  cover?: string;
  tags: string[];
}

export interface SubCategory {
  name: string;
  phrases: string[];
  items?: PhraseItem[];
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

export const findCategoryById = async (id: string) => {
  return prisma.category.findUnique({
    where: { id, deletedAt: null },
  });
};

export const createCategory = async (input: CategoryInput) => {
  return prisma.category.create({
    data: {
      mainCategory: input.mainCategory,
      subCategories: input.subCategories as any,
    },
  });
};

export const updateCategory = async (id: string, input: Partial<CategoryInput>) => {
  return prisma.category.update({
    where: { id },
    data: input as any,
  });
};

export const updateSubCategoryItems = async (categoryId: string, subCategoryName: string, items: PhraseItem[]) => {
  console.log('--- updateSubCategoryItems ---');
  console.log('ID:', categoryId, 'Sub:', subCategoryName);

  if (!categoryId) {
    throw new Error('Category ID is required');
  }

  // Try to find the category with a simple retry
  let category;
  try {
    category = await prisma.category.findUnique({
      where: { id: categoryId }
    });
  } catch (err) {
    console.error('Initial findUnique failed, retrying...', err);
    category = await prisma.category.findUnique({
      where: { id: categoryId }
    });
  }

  if (!category) {
    throw new Error('Category not found');
  }

  // Convert Json to array safely
  let subCategories: SubCategory[] = [];
  try {
    if (Array.isArray(category.subCategories)) {
      subCategories = category.subCategories as unknown as SubCategory[];
    } else if (typeof category.subCategories === 'string') {
      subCategories = JSON.parse(category.subCategories) as SubCategory[];
    } else {
      subCategories = (category.subCategories as any) || [];
    }
  } catch (e) {
    console.error('Json Parse Error:', e);
    subCategories = (category.subCategories as any) || [];
  }

  const updatedSubCategories = subCategories.map(sub => {
    if (sub.name === subCategoryName) {
      return {
        ...sub,
        items: items,
        phrases: items.map(i => i.name)
      };
    }
    return sub;
  });

  try {
    return await prisma.category.update({
      where: { id: categoryId },
      data: {
        subCategories: updatedSubCategories as any
      }
    });
  } catch (dbError: any) {
    console.error('Update failed, retrying once...', dbError);
    return await prisma.category.update({
      where: { id: categoryId },
      data: {
        subCategories: updatedSubCategories as any
      }
    });
  }
};

export const deleteCategory = async (id: string) => {
  return prisma.category.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const searchCategoriesByPhrase = async (keyword: string) => {
  const categories = await findAllCategories();
  const lowerKeyword = keyword.toLowerCase();
  
  return categories.filter((cat) => {
    // Search in main category name
    if (cat.mainCategory.toLowerCase().includes(lowerKeyword)) {
      return true;
    }

    const subs = cat.subCategories as unknown as SubCategory[];
    return subs.some((sub) =>
      // Search in subcategory name
      sub.name.toLowerCase().includes(lowerKeyword) ||
      // Search in items (new structure)
      (sub.items && sub.items.some(item => 
        item.name.toLowerCase().includes(lowerKeyword) ||
        item.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
      )) ||
      // Search in phrases (legacy structure)
      sub.phrases.some((phrase) =>
        phrase.toLowerCase().includes(lowerKeyword)
      )
    );
  });
};
