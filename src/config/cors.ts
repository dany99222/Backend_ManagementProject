import { CorsOptions } from "cors";
import dotenv from "dotenv";
dotenv.config();

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const whitelist = [
      process.env.FRONTEND_URL
    ];

    if (!origin) {
      return callback(null, true);
    }

    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error de CORS"));
    }
  },
  credentials: true,
};
