const { gql } = require("apollo-server-express");

const studentAttendanceTypeDefs = gql`
  type lessAttendanceStudentResult {
    student: StudentResult
    percentageOfPresents: Float
    classId: Class
  }
  type Query {
    lessAttendanceStudent: [lessAttendanceStudentResult]
  }
`;

module.exports = studentAttendanceTypeDefs;
