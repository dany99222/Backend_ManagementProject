// Archivo para connectarse a la base de datos

import mongoose from "mongoose";
import colors from "colors";
import { exit } from "node:process";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL);
    const url = `${connection.connection.host}:${connection.connection.port}`;

    console.log(colors.blue.bold(`MongoDB connected in: ${url}`));
  } catch (error) {
    console.log(colors.bgRed("Authentication failed.  Error to connect"));
    exit(1);
  }
};
