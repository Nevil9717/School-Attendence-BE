const { combineResolvers } = require("graphql-resolvers");
const { Attendance, StudentAttendance } = require("../../models");
const { default: mongoose } = require("mongoose");
const { isFaculty } = require("../auth");

const lessAttendanceStudent = combineResolvers(
  isFaculty,
  async (_, args, { user }) => {
    await Attendance.aggregate([ 
      {
        $match: {
          classId: new mongoose.Types.ObjectId(user.classId),
        },
      },
      {
        $unwind: "$students",
      },
      {
        $group: {
          _id: {
            student: "$students.student",
            classId: "$classId",
          },
          present: {
            $sum: { $cond: { if: "$students.status", then: 1, else: 0 } },
          },
          absent: {
            $sum: {
              $cond: { if: { $not: "$students.status" }, then: 1, else: 0 },
            },
          },
          totalDays: {
            $sum: 1,
          },
        },
      },
      {
        $addFields: {
          percentageOfPresents: {
            $multiply: [{ $divide: ["$present", "$totalDays"] }, 100],
          },
        },
      },

      {
        $project: {
          _id: "$_id.student",
          student: "$_id.student",
          classId: "$_id.classId",
          percentageOfPresents: 1,
        },
      },
      {
        $merge: "studentattendances",
      },
    ]);

    const studentList = await StudentAttendance.find({
      classId: new mongoose.Types.ObjectId(user.classId),
      percentageOfPresents: { $lt: 50 },
    }).populate([
      { path: "student", select: "firstName" },
      { path: "classId", select: "className" },
    ]);
    return studentList;
  }
);

const studentAttendanceResolvers = {
  Query: {
    lessAttendanceStudent,
  },
};

module.exports = studentAttendanceResolvers;
