import express, { Request, Response } from "express";

import { loginUser, signinUser } from "../controllers/user_controller";

const userRoutes = express.Router();


userRoutes.post("/signup", signinUser);

userRoutes.post("/signin", loginUser);


export default userRoutes; 

