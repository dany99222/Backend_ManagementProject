import { CorsOptions } from "cors";

// Nos sirve para permitir que nuestra url dele frontend  conecte con el backend
export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    
    const whitelist = [process.env.FRONTEND_URL];

if(process.argv[2] === '--api'){
  whitelist.push(undefined)
}

    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error de CORS"));
    }
  },
};
