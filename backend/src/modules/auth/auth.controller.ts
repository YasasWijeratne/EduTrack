import { Request, Response } from "express";
import { registerUser, loginUser, adminLoginUser } from "./auth.service";

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const result = await registerUser(
      firstName,
      lastName,
      email,
      password
    );

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Registration failed",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Login failed",
    });
  }
};

export const adminLogin = async (
  req: Request,
  res: Response
) => {
  try {

    const {
      email,
      password,
    } = req.body;

    const result =
      await adminLoginUser(
        email,
        password
      );

    res.status(200).json(
      result
    );

  } catch (error) {

    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Login failed",
    });

  }
};