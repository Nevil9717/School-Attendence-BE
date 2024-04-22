const { Role } = require("../../models");

const getRole = async (roleName) => {
  const role = await Role.findOne({ roleName });
  if (!role) return new Error("Role not found");
  return role._id;
};

module.exports = getRole;
