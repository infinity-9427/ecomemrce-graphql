import { mergeResolvers } from "@graphql-tools/merge";
import { productResolvers } from "./product.js";
import { categoryResolvers } from "./category.js";
import { userResolvers } from "./user.js";

export const resolvers = mergeResolvers([
  productResolvers,
  categoryResolvers,
  userResolvers
]);
