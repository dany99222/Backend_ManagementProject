// Creamos la logica del servidor
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import projectRoutes from "./routes/projectRoutes";

dotenv.config(); // carga las variables del archivo .env
connectDB(); //conexion hacia la base de datos
const app = express(); // incia la aplicacion de express

// Routers 
    // (arrupa diferentes grupos de rutas )
app.use('/api/projects', projectRoutes)

export default app;
