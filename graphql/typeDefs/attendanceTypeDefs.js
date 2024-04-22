const { gql } = require("apollo-server-express");

const attendanceTypeDefs = gql`
  type Attendance {
    date: String
    faculty: ID
    classId: ID
    students: [Student]
    totalStudents: Int
    presentStudents: Int
    absentStudents: Int
  }
  type Student {
    student: ID
    status: Boolean
  }
  input StudentInput {
    student: ID
    status: Boolean
  }
  type deleteAttendanceResult {
    message: String
  }
  type getSingleAttendanceResult {
    classId: Class
    totalStudents: Int
    presentStudents: Int
    absentStudents: Int
  }
  type Query {
    getSingleAttendance(date: String): getSingleAttendanceResult
    getAllAttendance: [Attendance]
  }
  type Mutation {
    createAttendance(date: String): Attendance
    updateAttendance(id: ID!): Attendance
    deleteAttendance(id: ID!): deleteAttendanceResult
    addStudentsAttendance(date: String, students: [StudentInput]): Attendance
  }
`;

module.exports = attendanceTypeDefs;
