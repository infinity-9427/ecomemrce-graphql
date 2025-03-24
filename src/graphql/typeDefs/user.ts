import gql from 'graphql-tag';

export const userTypeDefs = gql`
  enum UserRole {
    USER
    ADMIN
  }

  type User {
    id: Int!
    name: String
    email: String!
    role: UserRole!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    user(id: Int!): User
    users: [User]
  }
`;