import { CorsOptions } from "cors";

// Nos sirve para permitir que nuestra url dele frontend  conecte con el backend
export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    console.log(origin)
    const whitelist = [process.env.FRONTEND_URL];

    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error de CORS"));
    }
  },
};
