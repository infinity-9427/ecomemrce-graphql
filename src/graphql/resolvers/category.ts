import prisma from "../../config/prismaClient.js";

export const categoryResolvers = {
  Query: {
    category: async (_: any, { id }: { id: number }) => {
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          products: {
            include: { product: true }
          }
        }
      });
      if (category) {
        return { 
          ...category, 
          products: category.products.map((pc: any) => pc.product)
        };
      }
      return null;
    },
    categories: async () => {
      const categories = await prisma.category.findMany({
        include: {
          products: {
            include: { product: true }
          }
        }
      });
      return categories.map((category: any) => ({
        ...category,
        products: category.products.map((pc: any) => pc.product)
      }));
    }
  },
  Mutation: {
    createCategory: async (_: any, { input }: { input: { name: string } }) => {
      try {
        const newCategory = await prisma.category.create({
          data: {
            name: input.name
          }
        });
        return newCategory;
      } catch (error) {
        console.error("Error creating category:", error);
        throw error;
      }
    },
    updateCategory: async (_: any, { id, input }: { id: number; input: { name: string } }) => {
      try {
        const updatedCategory = await prisma.category.update({
          where: { id },
          data: {
            name: input.name
          }
        });
        return updatedCategory;
      } catch (error) {
        console.error("Error updating category:", error);
        throw error;
      }
    },
    deleteCategory: async (_: any, { id }: { id: number }) => {
      try {
        // Remove join records first if the category is linked to products
        await prisma.productCategory.deleteMany({
          where: { categoryId: id }
        });
        const deletedCategory = await prisma.category.delete({
          where: { id }
        });
        return deletedCategory;
      } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
      }
    }
  }
};
