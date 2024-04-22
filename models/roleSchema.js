const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
    enum: ["Admin", "Faculty", "Student"],
  },
});

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;
