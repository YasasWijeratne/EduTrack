import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "../user/user.model";
import Course from "../course/course.model";

export const getDashboardStats = async () => {
  const [totalCourses, totalLecturers, totalAdmins, totalActiveUsers] = await Promise.all([
    Course.countDocuments(),
    User.countDocuments({ role: "lecturer" }),
    User.countDocuments({ role: "admin" }),
    User.countDocuments({ isActive: true }),
  ]);

  return {
    totalCourses,
    totalLecturers,
    totalAdmins,
    totalActiveUsers,
  };
};

export const getUsersByRole = async (role?: string) => {
  const filter: { role?: "student" | "lecturer" | "admin" } = {};

  if (role && ["student", "lecturer", "admin"].includes(role)) {
    filter.role = role as "student" | "lecturer" | "admin";
  }

  const users = await User.find(filter)
    .select("firstName lastName email role isActive createdAt updatedAt")
    .sort({ createdAt: -1 })
    .lean();

  if (filter.role !== "lecturer") {
    return users;
  }

  const courseCounts = await Course.aggregate([
    {
      $group: {
        _id: "$lecturer",
        totalCourses: { $sum: 1 },
      },
    },
  ]);

  const courseCountMap = new Map<string, number>(
    courseCounts.map((entry) => [String(entry._id), entry.totalCourses])
  );

  return users.map((user) => ({
    ...user,
    courseCount: courseCountMap.get(String(user._id)) || 0,
  }));
};

export const getCoursesForAdmin = async () => {
  return Course.find()
    .populate("lecturer", "firstName lastName email role")
    .sort({ createdAt: -1 });
};

const countActiveAdmins = async () => {
  return User.countDocuments({ role: "admin", isActive: true });
};

const sanitizeUser = (user: {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const createUserByAdmin = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: "lecturer" | "admin"
) => {
  if (!["lecturer", "admin"].includes(role)) {
    throw new Error("Invalid role");
  }

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role,
  });

  return sanitizeUser(user);
};

export const getUserById = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user id");
  }

  const user = await User.findById(userId)
    .select("firstName lastName email role isActive createdAt updatedAt")
    .lean();

  if (!user) {
    throw new Error("User not found");
  }

  if (!["lecturer", "admin"].includes(user.role)) {
    throw new Error("User not found");
  }

  if (user.role === "lecturer") {
    const courseCount = await Course.countDocuments({ lecturer: userId });
    return { ...user, courseCount };
  }

  return user;
};

export const updateUserByAdmin = async (
  userId: string,
  actingAdminId: string,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    isActive?: boolean;
  }
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user id");
  }

  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new Error("User not found");
  }

  if (!["lecturer", "admin"].includes(user.role)) {
    throw new Error("Can only manage lecturers and admins");
  }

  if (data.isActive === false && userId === actingAdminId) {
    throw new Error("You cannot deactivate your own account");
  }

  if (data.isActive === false && user.role === "admin" && user.isActive) {
    const activeAdmins = await countActiveAdmins();
    if (activeAdmins <= 1) {
      throw new Error("Cannot deactivate the last active admin");
    }
  }

  if (typeof data.firstName === "string" && data.firstName.trim()) {
    user.firstName = data.firstName.trim();
  }

  if (typeof data.lastName === "string" && data.lastName.trim()) {
    user.lastName = data.lastName.trim();
  }

  if (typeof data.email === "string" && data.email.trim()) {
    const normalizedEmail = data.email.toLowerCase().trim();
    const duplicate = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: userId },
    });

    if (duplicate) {
      throw new Error("Email already in use");
    }

    user.email = normalizedEmail;
  }

  if (typeof data.password === "string" && data.password) {
    if (data.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    user.password = await bcrypt.hash(data.password, 10);
  }

  if (typeof data.isActive === "boolean") {
    user.isActive = data.isActive;
  }

  await user.save();

  const updated = await User.findById(userId)
    .select("firstName lastName email role isActive createdAt updatedAt")
    .lean();

  if (!updated) {
    throw new Error("User not found");
  }

  if (updated.role === "lecturer") {
    const courseCount = await Course.countDocuments({ lecturer: userId });
    return { ...updated, courseCount };
  }

  return updated;
};

export const deleteUserByAdmin = async (
  userId: string,
  actingAdminId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user id");
  }

  if (userId === actingAdminId) {
    throw new Error("You cannot delete your own account");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (!["lecturer", "admin"].includes(user.role)) {
    throw new Error("Can only delete lecturers and admins");
  }

  if (user.role === "admin" && user.isActive) {
    const activeAdmins = await countActiveAdmins();
    if (activeAdmins <= 1) {
      throw new Error("Cannot delete the last active admin");
    }
  }

  if (user.role === "lecturer") {
    const courseCount = await Course.countDocuments({ lecturer: userId });
    if (courseCount > 0) {
      throw new Error("Cannot delete lecturer with assigned courses");
    }
  }

  await user.deleteOne();

  return { message: "User deleted" };
};