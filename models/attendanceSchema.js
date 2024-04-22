const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    students: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

attendanceSchema.virtual("totalStudents").get(function () {
  return this.students.length;
});

attendanceSchema.virtual("presentStudents").get(function () {
  return this.students.filter((student) => student.status).length;
});

attendanceSchema.virtual("absentStudents").get(function () {
  return this.totalStudents - this.presentStudents;
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
