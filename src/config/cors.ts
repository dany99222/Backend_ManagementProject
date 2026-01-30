import { CorsOptions } from "cors";

// Nos sirve para permitir que nuestra url dele frontend  conecte con el backend
export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    
    const whitelist = [process.env.FRONTEND_URL];

 if (!origin) return callback(null, true);
 
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error de CORS"));
    }
  },
};
