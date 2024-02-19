import express, { Request, Response } from "express";

import { generateAndSendOTPByEmail, generateAndSendOTPBySMS, verifyOTPAndAuthenticate } from "../controllers/otp_controller";

const otpRoutes = express.Router(); 

otpRoutes.post("/send-otp-email", generateAndSendOTPByEmail);

otpRoutes.post("/verify-otp-email", verifyOTPAndAuthenticate);


otpRoutes.post("/send-otp-phone", generateAndSendOTPBySMS);

export default otpRoutes; 

