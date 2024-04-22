const { merge } = require("lodash");

const userResolvers = require("./userResolver");
const facultyResolvers = require("./facultyResolver");
const studentResolvers = require("./studentResolver");
const classResolvers = require("./classResolver");
const attendanceResolvers = require("./attendanceResolver");
const studentAttendanceResolvers = require("./studentAttendanceResolver");

const resolvers = merge(
  userResolvers,
  facultyResolvers,
  studentResolvers,
  classResolvers,
  attendanceResolvers,
  studentAttendanceResolvers
);
module.exports = resolvers;
