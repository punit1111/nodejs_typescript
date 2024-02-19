import { Request, Response, NextFunction } from "express";
import User from "../models/user_model";
import { generateOTP, verifyOTP } from "../utils/otpUtils/otp";
import OTP from "../models/otp_model";
import nodemailer from "nodemailer";

// Route handler to generate and send OTP via email
export async function generateAndSendOTPByEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, userId } = req.body;
    const otp = generateOTP(); 

    // Send OTP via email
    //await sendOTPByEmail(userId, email, otp, next);
    await saveOtp(userId, otp, next);

    res.status(200).json({ message: "OTP sent successfully", otp: otp });
  } catch (error) {
    console.error("Error sending OTP via email:", error);
    next(error);
  }
}

// Function to send OTP via email
async function sendOTPByEmail(
  userId: string,
  email: string,
  otp: string,
  next: NextFunction
) {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "Gmail",
    auth: {
      user: "punit4796@gmail.com", // Your Gmail email address
      pass: "pUNIT@9280", // Your Gmail password
    },
  });

  // Compose email
  const mailOptions = {
    from: "punit4796@gmail.com",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP for verification is: ${otp}`,
  };

  // Send email
  await transporter
    .sendMail(mailOptions)
    .then(async (result: any) => {
      console.log(`result otp one ${result}`);
      if (result) {
        console.log(`result otp two ${result}`);
        await saveOtp(userId, otp, next);
      }
    })
    .catch((err: any) => {
      console.log(`result otp two error ${err}`);
      next(err);
    });
}

// Route handler to generate and send OTP via SMS
export async function generateAndSendOTPBySMS(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { phoneNumber, userId } = req.body;
    const otp = generateOTP();

    // Send OTP via SMS
    //  await sendOTPBySMS(phoneNumber, otp);
    await retreiveOtp(userId, otp, next);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP via SMS:", error);
    next(error);
  }
}

// Function to send OTP via SMS
// async function sendOTPBySMS(phoneNumber: string, otp: string) {
//   const accountSid = "your_twilio_account_sid";
//   const authToken = "your_twilio_auth_token";

//   // Create a Twilio client
//   const client = twilio(accountSid, authToken);

//   // Send SMS
//   await client.messages.create({
//     body: `Your OTP for verification is: ${otp}`,
//     to: phoneNumber,
//     from: "+1234567890", // Your Twilio phone number
//   });
// }

export async function verifyOTPAndAuthenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId, email, otp } = req.body;

    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const expectedOTP = await retreiveOtp(userId, otp, next);

    // Verify OTP
    const isOTPValid = verifyOTP(expectedOTP as string, otp); // Implement this function to verify the OTP
    if (!isOTPValid) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    // If OTP is valid, authenticate the user
    // For simplicity, let's assume the user is authenticated

    res.status(200).json({ message: "User authenticated successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    next(error);
  }
}

async function saveOtp(userId: string, otp: string, next: NextFunction) {
  try {
    console.log(`result otp three`);
    await OTP.create({ userId, otp }, { fields: ["userId", "otp"] })
      .then((result) => {
        console.log(`result otp four ${result}`);
      })
      .catch((err) => {
        console.log(`result otp five ${err}`);
        next(err);
      });
  } catch (error) {
    next(error);
  }
}

async function retreiveOtp(userId: string, otp: string, next: NextFunction) {
  try {
    const otp = await OTP.findOne<OTP>({
      where: { userId: userId },
      order: [["createdAt", "DESC"]],
    })
      .then((result) => {
        console.log(`retrieve otp result ${result?.otp}`);
        return result?.otp.toString();
      })
      .catch((err) => {
        console.log(`retrieve otp err ${err}`);
        next(err);
      });
    if (otp) {
      return otp;
    }
  } catch (error) {
    console.log(`retrieve otp err ${error}`);
    next(error);
  }
}
