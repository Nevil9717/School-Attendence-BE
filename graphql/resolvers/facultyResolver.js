const { combineResolvers } = require("graphql-resolvers");
const getRole = require("../utils/getRole");
const { User, Class } = require("../../models");
const { isAdmin } = require("../auth");

const createFaculty = combineResolvers(
  isAdmin,
  async (_, { input }, { user }) => {
    try {
      const { email, classId } = input;
      const facultyExist = await User.findOne({ email, isDeleted: false });
      if (facultyExist) return new Error("Faculty already exist");
      const facultyWithSameClass = await User.findOne({
        classId,
        isDeleted: false,
        role: await getRole("Faculty"),
      });
      if (facultyWithSameClass)
        return new Error("A faculty is already associated with this class");
      const checkClassId = await Class.findOne({ _id: classId });
      if (checkClassId) {
        const facultyRoleId = await getRole("Faculty");
        input.createdBy = user._id;
        input.updatedBy = user._id;
        input.role = facultyRoleId;
        const faculty = await User(input);
        if (!faculty) return new Error("Error during faculty creation");
        await faculty.save();
        return faculty;
      } else return new Error("Invalid ClassId ");
    } catch (error) {
      return new Error(error);
    }
  }
);
const updateFaculty = combineResolvers(
  isAdmin,
  async (_, { id, input }, { user }) => {
    try {
      input.updatedBy = user._id;
      const updatedFaculty = await User.findOneAndUpdate(
        { _id: id, isDeleted: false, role: await getRole("Faculty") },
        input,
        {
          new: true,
        }
      );
      if (!updatedFaculty) return new Error("Faculty not found");
      return updatedFaculty;
    } catch (error) {
      return new Error(error);
    }
  }
);
const deleteFaculty = combineResolvers(isAdmin, async (_, { id }) => {
  try {
    const deletedFaculty = await User.findOneAndUpdate(
      { _id: id, isDeleted: false, role: await getRole("Faculty") },
      { isDeleted: true },
      { new: true }
    );
    if (!deletedFaculty) return new Error("Faculty not found");
    return { message: "Faculty Deleted Successful" };
  } catch (error) {
    return { message: "Error during delete", error: error.message };
  }
});
const getSingleFaculty = combineResolvers(isAdmin, async (_, { id }) => {
  try {
    const faculty = await User.findOne({
      _id: id,
      isDeleted: false,
      role: await getRole("Faculty"),
    });
    if (!faculty) return new Error("Faculty not found");
    return faculty;
  } catch (error) {
    return new Error(error);
  }
});
const getAllFaculties = combineResolvers(isAdmin, async () => {
  try {
    const faculties = await User.find({
      isDeleted: false,
      role: await getRole("Faculty"),
    });
    if (!faculties) return new Error("Faculty not found");
    return faculties;
  } catch (error) {
    return new Error(error);
  }
});
const facultyResolver = {
  Query: {
    getSingleFaculty,
    getAllFaculties,
  },
  Mutation: {
    createFaculty,
    updateFaculty,
    deleteFaculty,
  },
};

module.exports = facultyResolver;
