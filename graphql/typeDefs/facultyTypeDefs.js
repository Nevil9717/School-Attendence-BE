const { gql } = require("apollo-server-express");

const facultyTypeDefs = gql`
  type Faculty {
    firstName: String
    lastName: String
    email: String
    gender: String
    role: ID
    classId: ID
    password: String
    isDeleted: Boolean
    createdBy: ID
    updatedBy: ID
  }
  input facultyInput {
    firstName: String
    lastName: String
    email: String
    gender: String
    password: String
    classId: ID
  }
  type deleteFacultyResult {
    message: String
  }
  type Query {
    getSingleFaculty(id: ID!): Faculty
    getAllFaculties: [Faculty]
  }
  type Mutation {
    createFaculty(input: facultyInput): Faculty
    updateFaculty(id: ID!, input: facultyInput): Faculty
    deleteFaculty(id: ID!): deleteFacultyResult
  }
`;

module.exports = facultyTypeDefs;
