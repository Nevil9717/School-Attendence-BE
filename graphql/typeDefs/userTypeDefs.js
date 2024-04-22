const { gql } = require("apollo-server-express");

const userTypeDefs = gql`
  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    gender: genderOptions
    password: String
    role: RoleOptions
    classId: ID
    enrollment: Int
    isDeleted: Boolean
    createdBy: ID
    updatedBy: ID
  }
  type RoleOptions {
    _id: ID
    role: String
  }
  enum genderOptions {
    male
    female
  }

  input UserInput {
    firstName: String!
    lastName: String
    email: String!
    gender: genderOptions
    password: String
    enrollment: Int
    classId: ID
  }
  input loginInput {
    email: String!
    password: String!
  }

  type loginResult {
    token: String
  }

  type Query {
    getUsers: [User]
  }
  type Mutation {
    loginUser(input: loginInput): loginResult
  }
`;

module.exports = userTypeDefs;
