const { gql } = require("apollo-server-express");

const studentTypeDefs = gql`
  type StudentResult {
    firstName: String
    lastName: String
    email: String
    gender: String
    role: ID
    classId: Class
    enrollment: String
    password: String
    isDeleted: Boolean
    createdBy: ID
    updatedBy: ID
  }
  input studentInput {
    firstName: String
    lastName: String
    email: String
    gender: String
    password: String
  }
  type deleteStudentResult {
    message: String
  }

  type Query {
    getSingleStudent(id: ID!): StudentResult
    getAllStudents: [StudentResult]
    getProfile: StudentResult
  }
  type Mutation {
    createStudent(input: studentInput): StudentResult
    updateStudent(id: ID!, input: studentInput): StudentResult
    deleteStudent(id: ID!): deleteStudentResult
  }
`;
module.exports = studentTypeDefs;
