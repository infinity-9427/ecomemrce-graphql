import gql from 'graphql-tag';

export const productTypeDefs = gql`
  type Image {
    public_id: String!
    url: String!
  }

  type Product {
    id: Int!
    title: String!
    description: String!
    price: Float!
    images: [Image]
    categories: [Category]
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    product(id: Int!): Product
    products: [Product]
  }

  input ImageInput {
    public_id: String!
    url: String!
  }

  input ProductInput {
    title: String!
    description: String!
    price: Float!
    images: [ImageInput!]
    categoryIds: [Int!]
  }

  extend type Mutation {
    createProduct(input: ProductInput!): Product
    updateProduct(id: Int!, input: ProductInput!): Product
    deleteProduct(id: Int!): Product
  }
`;