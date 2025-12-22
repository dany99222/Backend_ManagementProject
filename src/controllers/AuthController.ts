import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import { hashPassword } from "../utils/auth";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      //Tomamos el password del body
      const { password } = req.body;
      //Tomamos el valor de el body
      const user = new User(req.body);

      //Hash password
      user.password = await hashPassword(password);

      //Lo guardamos
      await user.save();

      //Si es creada correctamente resivimos una repuesta del servidor
      res.send("Cuenta creada, verifica el email para confirmarla");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
