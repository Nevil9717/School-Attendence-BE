const mongoose = require("mongoose");
const studentAttendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  percentageOfPresents: {
    type: Number,
  },
});

const StudentAttendance = mongoose.model(
  "StudentAttendance",
  studentAttendanceSchema
);
module.exports = StudentAttendance;
