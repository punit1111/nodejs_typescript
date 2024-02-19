// otp.model.ts

import { Model, DataTypes, UUIDV4 } from "sequelize";
import sequelize from "../config/database/sequelize";

interface OTPAttributes {
  id?: number;
  userId: string;
  otp: string;
  expiresAt?: Date;
}

class OTP extends Model<OTPAttributes> implements OTPAttributes {
  id?: number;
  userId!: string;
  otp!: string;
  expiresAt!: Date; 
}

OTP.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }, 
  },
  {
    sequelize,
    tableName: "otp", // Change this if you want a different table name
  }
);

export default OTP;
