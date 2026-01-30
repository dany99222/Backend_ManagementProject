import { CorsOptions } from "cors";
import dotenv from "dotenv";
dotenv.config();

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {

    if (!origin) {
      return callback(null, true);
    }

    // Permitir cualquier subdominio de Vercel
    if (
      origin.includes(".vercel.app") ||
      origin === process.env.FRONTEND_URL
    ) {
      return callback(null, true);
    }

    callback(new Error("Error de CORS"));
  },
  credentials: true,
};
