const mongoose = require("mongoose");
const { Role, User } = require("../models");

async function setupDefaultRoles() {
  try {
    // Check if roles exist
    const adminRole = await Role.findOne({ roleName: "Admin" });
    const facultyRole = await Role.findOne({ roleName: "Faculty" });
    const studentRole = await Role.findOne({ roleName: "Student" });
    // If roles don't exist, create them
    if (!adminRole) {
      await Role.create({ roleName: "Admin" });
      console.log("Admin created successfully.");
    }
    if (!facultyRole) {
      await Role.create({ roleName: "Faculty" });
      console.log("Faculty created successfully.");
    }
    if (!studentRole) {
      await Role.create({ roleName: "Student" });
      console.log("student created successfully.");
    }
  } catch (error) {
    console.error("Error setting up default roles:", error);
  }
}
const createFirstAdminUser = async () => {
  try {
    const adminRole = await Role.findOne({ roleName: "Admin" });
    if (adminRole) {
      const existingAdminUser = await User.findOne({ role: adminRole._id });
      if (!existingAdminUser) {
        // Create first admin user if it doesn't exist
        await User.create({
          firstName: "admin",
          lastName: "admin",
          email: "admin@gmail.com",
          password: "admin",
          role: adminRole._id,
        });
        console.log("First admin user created.");
      }
    }
  } catch (error) {
    console.error("Error creating first admin user:", error);
  }
};

mongoose
  .connect(process.env.DB_LINK)
  .then(async () => {
    await setupDefaultRoles();
    await createFirstAdminUser();
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });
