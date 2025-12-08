// Creamos la logica del servidor
import express from "express";
import dotenv from 'dotenv'
import { connectDB } from "./config/db";


dotenv.config() // carga las variables del archivo .env
connectDB() //conexion hacia la base de datos
const app = express(); // incia la aplicacion de express

export default app;
