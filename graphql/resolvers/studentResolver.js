const { combineResolvers } = require("graphql-resolvers");

const getRole = require("../utils/getRole");
const { User } = require("../../models");
const { isFaculty, isStudent } = require("../auth");

const createStudent = combineResolvers(
  isFaculty,
  async (_, { input }, { user }) => {
    try {
      const { email } = input;
      const studentExist = await User.findOne({
        email,
        isDeleted: false,
        role: await getRole("Student"),
      });
      if (studentExist) return new Error("Student already exist");
      const studentRoleId = await getRole("Student");
      input.role = studentRoleId;
      input.enrollment = Date.now();
      input.createdBy = user._id;
      input.updatedBy = user._id;
      input.classId = user.classId;
      const student = await User(input);
      if (!student) return new Error("Error during student creation");
      await student.save();
      return student;
    } catch (error) {
      return new Error("Error during student creation", error);
    }
  }
);
const updateStudent = combineResolvers(
  isFaculty,
  async (_, { id, input }, { user }) => {
    try {
      input.updatedBy = user._id;
      const updatedStudent = await User.findOneAndUpdate(
        { _id: id, isDeleted: false, role: await getRole("Student") },
        input,
        {
          new: true,
        }
      );
      if (!updatedStudent) return new Error("Student not found");
      return updatedStudent;
    } catch (error) {
      return new Error(error);
    }
  }
);
const deleteStudent = combineResolvers(isFaculty, async (_, { id }) => {
  try {
    const deletedStudent = await User.findOneAndUpdate(
      { _id: id, isDeleted: false, role: await getRole("Student") },
      { isDeleted: true },
      { new: true }
    );
    if (!deletedStudent) return new Error("Student not found");
    return { message: "Student Deleted Successful" };
  } catch (error) {
    return { message: "Error during delete", error: error.message };
  }
});
const getSingleStudent = combineResolvers(isFaculty, async (_, { id }) => {
  try {
    const student = await User.findOne({
      _id: id,
      isDeleted: false,
      role: await getRole("Student"),
    }).populate(
      { path: "classId", select: "className" },
      { path: "role", select: "roleName" }
    );
    if (!student) return new Error("Student not found");
    return student;
  } catch (error) {
    return new Error(error);
  }
});
const getAllStudents = combineResolvers(isFaculty, async () => {
  try {
    const students = await User.find({
      isDeleted: false,
      role: await getRole("Student"),
    });
    return students;
  } catch (error) {
    return new Error(error);
  }
});
const getProfile = combineResolvers(isStudent, async (_, args, { user }) => {
  try {
    const student = await User.findOne({ _id: user._id, isDeleted: false });
    if (!student) return new Error("Student not found");
    return student;
  } catch (error) {
    return new Error(error);
  }
});

const studentResolver = {
  Query: {
    getSingleStudent,
    getAllStudents,
    getProfile,
  },
  Mutation: {
    createStudent,
    updateStudent,
    deleteStudent,
  },
};
module.exports = studentResolver;
