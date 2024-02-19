import express, { Request, Response, NextFunction } from "express";
import User from "../models/user_model";
import { CustomError, StatusCodes } from "../error_handler/app_error";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function signinUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, email, password } = req.body;

    await User.findOne<User>({ where: { email: email } }).then(
      async (resultUser) => {
        if (resultUser) {
          next(
            new CustomError(
              StatusCodes.INTERNAL_SERVER_ERROR,
              "User already exist"
            )
          );
        } else {
          // Hash the password before saving it
          const hashedPassword = await bcrypt.hash(password, 10);

          const user = User.create(
            { name, email, password:hashedPassword },
            { fields: ["name", "email", "password"] }
          )
            .then((result) => {
              res
                .status(201)
                .send({ message: "User created!", userId: result.id });
            })
            .catch((err) => {
              if (!err.statusCode) {
                err.statusCode = 500;
              }
              next(err);
            });
        }
      }
    );
  } catch (error) {
    next(error);
  }
}

export async function loginUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ userId: user.id }, "your_secret_key", {
      expiresIn: "1h",
    });

    res.status(200).json({ user: user.toJSON, token: token });
  } catch (error) {
    console.error("Error logging in user:", error);
    next(error);
  }
}
