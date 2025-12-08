import type { Request, Response } from "express";
import Proyect from "../models/Proyect";

export class ProjectController {

  // Crear Proyecto 
  static createProject = async (req: Request, res: Response) => {
    // Creamos una instancia al modelo y le pasamos los datos que envia el cliente
    const project = new Proyect(req.body);

    try {
      //Si es correctp se guarda
      await project.save();
      res.send("Proyecto Creado Correctamente");
    } catch (error) {
      console.log(error);
    }
  };

  static getAllProjects = async (req: Request, res: Response) => {
    res.send("Todos los Proyectos");
  };
}
