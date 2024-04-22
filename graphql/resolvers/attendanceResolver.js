const { combineResolvers } = require("graphql-resolvers");
const getRole = require("../utils/getRole");

const { Attendance, User } = require("../../models");

const { isFaculty } = require("../auth");

const createAttendance = combineResolvers(
  isFaculty,
  async (_, { date }, { user }) => {
    try {
      const classId = user.classId;
      const faculty = user._id;
      const studentList = await User.find(
        {
          classId: classId,
          isDeleted: false,
          role: await getRole("Student"),
        },
        { _id: 1 }
      );
      const students = [];
      studentList.forEach((student) => {
        students.push({ student: student._id, status: false });
      });
      const attendance = await Attendance.create({
        date,
        classId,
        faculty,
        students,
      });
      await attendance.save();
      return attendance;
    } catch (error) {
      return new Error(error);
    }
  }
);
const updateAttendance = combineResolvers(
  isFaculty,
  async (_, { id, input }, { user }) => {
    try {
      const updatedAttendance = await Attendance.findOneAndUpdate(
        { _id: id, classId: user.classId, faculty: user._id },
        input,
        {
          new: true,
        }
      );
      if (!updatedAttendance) return new Error("Attendance not found");
      return updatedAttendance;
    } catch (error) {
      return new Error(error);
    }
  }
);
const deleteAttendance = combineResolvers(
  isFaculty,
  async (_, { id }, { user }) => {
    try {
      const deletedAttendance = await Attendance.findOneAndDelete({
        _id: id,
        classId: user.classId,
        faculty: user._id,
      });
      if (!deletedAttendance) return new Error("Attendance not found");
      return { message: "Attendance deleted successfully" };
    } catch (error) {
      return new Error(error);
    }
  }
);
const getSingleAttendance = combineResolvers(
  isFaculty,
  async (_, { date }, { user }) => {
    try {
      const attendance = await Attendance.findOne({
        classId: user.classId,
        faculty: user._id,
        date,
      }).populate("classId", "className");

      if (!attendance) return new Error("Attendance not found");
      return attendance;
    } catch (error) {
      throw error;
    }
  }
);
const getAllAttendance = combineResolvers(
  isFaculty,
  async (_, args, { user }) => {
    try {
      const attendance = await Attendance.find({
        classId: user.classId,
        faculty: user._id,
      });
      if (!attendance) return new Error("Attendance not found");
      return attendance;
    } catch (error) {
      return new Error(error);
    }
  }
);
const addStudentsAttendance = combineResolvers(
  isFaculty,
  async (_, { date, students }, { user }) => {
    try {
      const attendance = await Attendance.findOne({
        classId: user.classId,
        faculty: user._id,
        date,
      });
      if (!attendance) return new Error("Attendance not found");
      students.forEach((student) => {
        const index = attendance.students.findIndex(
          (s) => s.student.toString() === student.student
        );
        if (index !== -1) {
          attendance.students[index].status = student.status;
        }
      });
      await attendance.save();
      return attendance;
    } catch (error) {
      return new Error(error);
    }
  }
);

const attendanceResolver = {
  Query: {
    getSingleAttendance,
    getAllAttendance,
  },
  Mutation: {
    createAttendance,
    updateAttendance,
    deleteAttendance,
    addStudentsAttendance,
  },
};

module.exports = attendanceResolver;
