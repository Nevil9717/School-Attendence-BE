const { skip } = require("graphql-resolvers");
const { User } = require("../models");
const getRole = require("./utils/getRole");

const isAdmin = async (_, args, { user }) => {
  try {
    const userData = await User.findById(user._id);
    if (!userData) return new Error("Not Authenticated");
    const roleId = await getRole("Admin");
    if (!userData.role.equals(roleId)) return new Error("Not Authorized");
    skip;
  } catch (error) {
    return new Error("Error while Authentication", error);
  }
};
const isFaculty = async (_, args, { user }) => {
  try {
    const userData = await User.findById(user._id);
    if (!userData) return new Error("Not Authenticated");
    const roleId = await getRole("Faculty");
    if (!userData.role.equals(roleId)) return new Error("Not Authorized");
    skip;
  } catch (error) {
    return new Error("Error while Authentication");
  }
};
const isStudent = async (_, args, { user }) => {
  try {
    const userData = await User.findById(user._id, { password: 0 });
    if (!userData) return new Error("Not Authenticated");
    const roleId = await getRole("Student");
    if (!userData.role.equals(roleId)) return new Error("Not Authorized");
    skip;
  } catch (error) {
    return new Error("Error while Authentication");
  }
};

module.exports = { isAdmin, isFaculty, isStudent };
