import bcrypt from "bcrypt";
import User from "../user/user.model";
import generateToken from "../../utils/generateToken";

export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: "student",
  });

  const token = generateToken(
    user._id.toString(),
    user.role
  );

  return {
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  };
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  if (!user.isActive) {
    throw new Error("Account is deactivated. Contact an administrator.");
  }

  const token = generateToken(
    user._id.toString(),
    user.role
  );

  return {
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  };
};

export const adminLoginUser = async (
  email: string,
  password: string
) => {

  const user = await User.findOne({
    email,
  }).select("+password");

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  if (user.role !== "admin") {
    throw new Error(
      "Admin access only"
    );
  }

  if (!user.isActive) {
    throw new Error("Account is deactivated. Contact an administrator.");
  }

  const token = generateToken(
    user._id.toString(),
    user.role
  );

  return {
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  };
};