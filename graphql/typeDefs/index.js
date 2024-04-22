const attendanceTypeDefs = require("./attendanceTypeDefs");
const classTypeDefs = require("./classTypeDefs");
const facultyTypeDefs = require("./facultyTypeDefs");
const studentTypeDefs = require("./studentTypeDefs");
const userTypeDefs = require("./userTypeDefs");
const studentAttendanceTypeDefs = require("./studentAttendanceTypeDefs");
module.exports = [
  attendanceTypeDefs,
  userTypeDefs,
  classTypeDefs,
  facultyTypeDefs,
  studentTypeDefs,
  studentAttendanceTypeDefs,
];
