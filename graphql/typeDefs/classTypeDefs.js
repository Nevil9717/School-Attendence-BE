const { gql } = require("apollo-server-express");

const classTypeDefs = gql`
  type Class {
    _id: ID
    className: String
  }
  input classInput {
    _id: ID
    className: String
  }
  type deleteClassResult {
    message: String
  }
  type Query {
    getSingleClass(_id: ID!): Class
    getAllClass: [Class]
  }
  type Mutation {
    createClass(className: String!): Class
    updateClass(input: classInput): Class
    deleteClass(_id: ID!): deleteClassResult
  }
`;

module.exports = classTypeDefs;
