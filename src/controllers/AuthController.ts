import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import { hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";

export class AuthController {
  //Crear cuenta
  static createAccount = async (req: Request, res: Response) => {
    try {
      //Tomamos el password e email del body
      const { password, email } = req.body;

      //Preveenir duplicados
      const userExist = await User.findOne({ email });
      console.log(userExist);
      if (userExist) {
        const error = new Error("El usuario ya esta registrado");
        return res.status(409).json({ error: error.message });
      }

      //Creamos un usuario
      const user = new User(req.body);

      //Hash password
      user.password = await hashPassword(password);

      //Generamos un nuevo password
      const token = new Token();
      token.token = generateToken();
      token.user = user._id;

      //Enviamos el email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.email,
        token: token.token,
      });

      // Guardamos en la base de datos
      await Promise.allSettled([user.save(), token.save()]);

      //Si es creada correctamente resivimos una repuesta del servidor
      res.send("Cuenta creada, verifica el email para confirmarla");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      //Tomamos token del body
      const { token } = req.body;

      //Hacemos una consulta para ver si existe el token
      const tokenExist = await Token.findOne({ token });

      //Si no existe el suario nos devuelve ste error
      if (!tokenExist) {
        const error = new Error("Token no valido");
        return res.status(401).json({ error: error.message });
      }

      // Si existe el usuario
      //Ahora Buscamos al usuario mediante el id del usuario de dicho token
      const user = await User.findById(tokenExist.user);
      //Cambiamos a true la conformacion
      user.confirmed = true;

      // Hacemos cambios en la BD
      await Promise.allSettled([
        user.save(), // Guardamos los cambios de usuario
        tokenExist.deleteOne(), //Eliminamos el token y sus campos
      ]);

      res.send("Cuenta confirmada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
