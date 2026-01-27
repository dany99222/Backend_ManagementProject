import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

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
        name: user.name,
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

  //Confirmar cuenta
  static confirmAccount = async (req: Request, res: Response) => {
    try {
      //Tomamos token del body
      const { token } = req.body;

      //Hacemos una consulta para ver si existe el token
      const tokenExist = await Token.findOne({ token });

      //Si no existe el suario nos devuelve ste error
      if (!tokenExist) {
        const error = new Error("Token no valido");
        return res.status(404).json({ error: error.message });
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

  //Login, verificar si el usuario existe y validar qie sea true, en caso contrario mandar token
  static login = async (req: Request, res: Response) => {
    try {
      //Extraemos el email y el password del body
      const { email, password } = req.body;

      //Consultamos si existe en email
      const user = await User.findOne({ email });

      //Validar si el usuario existe
      if (!user) {
        const error = new Error("Usuario no encontrado");
        return res.status(404).json({ error: error.message });
      }
      //Validar que el confirmed del usuario sea true
      if (!user.confirmed) {
        //Genera otro token al usuario
        const token = new Token();
        token.user = user._id;
        token.token = generateToken();
        //Almacenamos este token en la bd
        await token.save();
        //Enviamos el email
        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        });

        const error = new Error(
          "La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmacion",
        );
        return res.status(401).json({ error: error.message });
      }

      // Si la cuenta ya es confirmada
      //revisar password
      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        const error = new Error("Password Incorrecto");
        return res.status(404).json({ error: error.message });
      }

      const token = generateJWT({ id: user._id });

      res.send(token);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  //Solicitar nuevo codigo de conformacion
  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      //Tomamos el password e email del body
      const { email } = req.body;

      //usuario existe
      const user = await User.findOne({ email });

      if (!user) {
        const error = new Error("El Usuario no esta registrado");
        return res.status(404).json({ error: error.message });
      }

      //Verificamos si el usuarioe sta confirmafo
      if (user.confirmed) {
        const error = new Error("El Usuario ya esta confirmado");
        return res.status(409).json({ error: error.message });
      }

      //Generamos un nuevo password
      const token = new Token();
      token.token = generateToken();
      token.user = user._id;

      //Enviamos el email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      // Guardamos en la base de datos
      await Promise.allSettled([user.save(), token.save()]);

      //Si es creada correctamente resivimos una repuesta del servidor
      res.send("Se envio un nuevo token a tu email");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  // Restablecer el password
  static forgotPassword = async (req: Request, res: Response) => {
    try {
      //Tomamos el password e email del body
      const { email } = req.body;

      //usuario existe
      const user = await User.findOne({ email });

      if (!user) {
        const error = new Error("El Usuario no esta registrado");
        return res.status(404).json({ error: error.message });
      }

      //Generamos un nuevo token
      const token = new Token();
      token.token = generateToken();
      token.user = user._id;
      await token.save();

      //Enviamos el email
      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      //Si es creada correctamente resivimos una repuesta del servidor
      res.send("Revisa tu email para istrucciones");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  //Validando el token
  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        const error = new Error("Token no válido");
        res.status(404).json({ error: error.message });
        return;
      }
      res.send("Token válido, define tu nueva contraseña");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
  //Validando el token
  static updatePasswordWhithToken = async (req: Request, res: Response) => {
    try {
      //Tomamos token del body
      const { token } = req.params;

      //Hacemos una consulta para ver si existe el token
      const tokenExist = await Token.findOne({ token });

      //Si no existe el suario nos devuelve ste error
      if (!tokenExist) {
        const error = new Error("Token no valido");
        return res.status(404).json({ error: error.message });
      }

      // Enocntramos el usuario por su id
      const user = await User.findById(tokenExist.user);
      //Se hashea el nuevo password
      user.password = await hashPassword(req.body.password);

      // escribimos los cambios en el usuario y eliminamos el token
      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);

      res.send("El passwor se modifico correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  //Validando el token
  static user = async (req: Request, res: Response) => {
    return res.json(req.user);
  };

  static updateProfile = async (req: Request, res: Response) => {
    const { name, email } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist && userExist._id.toString() !== req.user._id.toString()) {
      const error = new Error("Ese email ya esta registrado");
      return res.status(409).json({ error: error.message });
    }

    req.user.name = name;
    req.user.email = email;

    try {
      await req.user.save();
      res.send("Perfil Actualizado Correctamente");
    } catch (error) {
      res.status(500).send("Hubo un error");
    }
  };

  static updateCurrentUserPassword = async (req: Request, res: Response) => {
    const { current_password, password } = req.body;
    const user = await User.findById(req.user._id);
    const isPasswordCorrect = await checkPassword(
      current_password,
      user.password,
    );

    if (!isPasswordCorrect) {
      const error = new Error("El password actual es incorrecto");
      return res.status(401).json({ error: error.message });
    }

    try {
      user.password = await hashPassword(password);
      await user.save();
      res.send("El password se modifico correctamente");
    } catch (error) {
      res.status(500).send("Hubo un error");
    }
  };
}
