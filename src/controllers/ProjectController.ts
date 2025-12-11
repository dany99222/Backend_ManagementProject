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
      const project = await Proyect.findById(id).populate("tasks");

      //Validacion si lel proyecto no es encontrado
      if (!project) {
        const error = new Error("Proyecto no encontrado");
        return res.status(404).json({ error: error.message });
      }
      res.json(project);
    } catch (error) {
      console.log(error);
    }
  };

  // Trarnos un proyecto por su ID y actualizarlo
  static updateProject = async (req: Request, res: Response) => {
    //params nos ayuda a obtener datos en la ruta
    const { id } = req.params;
    try {
      //Encuentra un registro por su id y lo actualiza con el segundo parametro
      const project = await Proyect.findByIdAndUpdate(id, req.body);

      //validacion si el proyecto no es encontrado
      if (!project) {
        const error = new Error("Proyecto no encontrado");
        return res.status(404).json({ error: error.message });
      }
      await project.save(); //Guardamos la actualizacion
      res.send("Proyecto Actualizado"); //Enviamos el mesnaje
    } catch (error) {
      console.log(error);
    }
  };

  // Trarnos un proyecto por su ID y actualizarlo
  static deleteProject = async (req: Request, res: Response) => {
    //params nos ayuda a obtener datos en la ruta
    const { id } = req.params;
    try {
      const project = await Proyect.findById(id);

      //validacion si el proyecto no es encontrado
      if (!project) {
        const error = new Error("Proyecto no encontrado");
        return res.status(404).json({ error: error.message });
      }

      await project.deleteOne();
      res.send("Proyecto Eliminado");
    } catch (error) {
      console.log(error);
    }
  };
}
