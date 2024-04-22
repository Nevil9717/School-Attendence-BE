const { combineResolvers } = require("graphql-resolvers");

const { Class, User } = require("../../models");
const { isAdmin } = require("../auth");
const getRole = require("../utils/getRole");
const createClass = combineResolvers(isAdmin, async (_, { className }) => {
  try {
    const setClassName = await Class({ className });
    await setClassName.save();
    return setClassName;
  } catch (error) {
    return new Error(error);
  }
});
const updateClass = combineResolvers(isAdmin, async (_, { input }) => {
  const updatedClass = await Class.findByIdAndUpdate(input._id, input, {
    new: true,
  });
  if (!updatedClass) return new Error("Class not found");
  return updatedClass;
});
const deleteClass = combineResolvers(isAdmin, async (_, { _id }) => {
  const facultyWithClass = await User.findOne({
    classId: _id,
    role: await getRole("Faculty"),
  });
  if (facultyWithClass) {
    return new Error(
      `${
        facultyWithClass.firstName + " " + facultyWithClass.lastName
      } is assigned to this class, please reassign the faculty to another class before deleting this class`
    );
  }
  const deletedClass = await Class.findByIdAndDelete(_id);
  if (!deletedClass) return new Error("Class not found");
  return { message: "Class Deleted Successfully" };
});
const getSingleClass = combineResolvers(isAdmin, async (_, { _id }) => {
  const singleClass = await Class.findById(_id);
  if (!singleClass) return new Error("Class not found");
  return singleClass;
});
const getAllClass = combineResolvers(isAdmin, async () => {
  const allClass = await Class.find();
  if (!allClass) return new Error("Class not found");
  return allClass;
});

const classResolver = {
  Query: {
    getSingleClass,
    getAllClass,
  },
  Mutation: {
    createClass,
    updateClass,
    deleteClass,
  },
};

module.exports = classResolver;
