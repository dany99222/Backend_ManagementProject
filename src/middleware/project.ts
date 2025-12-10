import type { Request, Response, NextFunction } from "express";
import Proyect, { InterfaceProyect } from "../models/Proyect";

//Agrega al objeto req propiedades personalizadas
declare global {
  namespace Express {
    interface Request {
        project: InterfaceProyect
    }
  }
}

export async function validateProjectExist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    //Extraemos este parametro de la url
    const { projectId } = req.params;

    //Nos traemos el proyecto de la bd
    const project = await Proyect.findById(projectId);

    //Validamos si el proyecto existe en la bd
    if (!project) {
      const error = new Error("Proyecto no encontrado");
      return res.status(404).json({ error: error.message });
    }

    req.project = project

    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
}
