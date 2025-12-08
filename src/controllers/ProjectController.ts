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

  // Traernos los proyectos
  static getAllProjects = async (req: Request, res: Response) => {
    try {
      //Nos trae los proyectos de la BD
      const projects = await Proyect.find({});
      res.json(projects);
    } catch (error) {
      console.log(error);
    }
  };

  // Trarnos un proyecto por su ID
  static getProjectByID = async (req: Request, res: Response) => {
    //params nos ayuda a obtener datos en la ruta
    const { id } = req.params;

    try {
      //Consulta a la bd
      const project = await Proyect.findById(id);
      if (!project) {
        const error = new Error('Proyecto no encontrado')
        return res.status(404).json({error: error.message});
      }
    } catch (error) {
      console.log(error);
    }
  };
}
