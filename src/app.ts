import express, { Request, Response } from "express";

import userRoutes from "./routes/user_routes";

import otpRoutes from "./routes/otp_routes";

import sequelize from "./config/database/sequelize";

import { errorHandler } from "./error_handler/app_error";

const app = express();

const port = 3000; 

app.use(express.json());
 
app.use("/user", userRoutes);  

app.use("/otp", otpRoutes);  

app.use(errorHandler);

sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });
