import prisma from "../../config/prismaClient.js";

export const userResolvers = {
    Query: {
      user: async (_: any, { id }: { id: number }) => {
        return await prisma.user.findUnique({
          where: { id }
        });
      },
      users: async (_: any, __: any) => {
        return await prisma.user.findMany();
      }
    }
  };
  