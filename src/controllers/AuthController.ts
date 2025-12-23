import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import { hashPassword } from "../utils/auth";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      //Tomamos el password e email del body
      const { password, email } = req.body;

      //Preveenir duplicados
      const userExist = await User.findOne({ email });
      console.log(userExist)
      if (userExist) {
        const error = new Error("El usuario ya esta registrado");
        return res.status(409).json({ error: error.message });
      }

      //Creamos un usuario
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
