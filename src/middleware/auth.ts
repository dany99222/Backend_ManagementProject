import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { InterfaceUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: InterfaceUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;

  console.log(req.headers.authorization);

  //Comprueb  si el usuario esta autenticado
  if (!bearer) {
    const error = new Error("No Autorizado");
    return res.status(401).json({ error: error.message });
  }

  //Quitamos el bearer palabra
  const token = bearer.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof decoded === "object" && decoded.id) {
      const user = await User.findById(decoded.id).select('_id name email');
      if (user) {
        req.user = user;
        next()
      } else {
        res.status(500).json({ error: "Token No Valido" });
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Token No Valido" });
  }

};
