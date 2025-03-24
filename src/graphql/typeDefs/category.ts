import gql from 'graphql-tag';

export const categoryTypeDefs = gql`
  type Category {
    id: Int!
    name: String!
    products: [Product]
    createdAt: String!
    updatedAt: String!
  }

  input CategoryInput {
    name: String!
  }

  extend type Query {
    category(id: Int!): Category
    categories: [Category]
  }

  extend type Mutation {
    createCategory(input: CategoryInput!): Category
    updateCategory(id: Int!, input: CategoryInput!): Category
    deleteCategory(id: Int!): Category
  }
`;
