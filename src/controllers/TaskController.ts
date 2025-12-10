import type { Request, Response } from "express";
import Proyect from "../models/Proyect";
import Task from "../models/Task";

export class TaskControler {
  // Crear tarea
  static createTask = async (req: Request, res: Response) => {
    //Extraemos este parametro de la url
    const { projectId } = req.params;

    //Nos traemos el proyecto de la bd
    const project = await Proyect.findById(projectId);

    //Validamos si el proyecto existe en la bd
    if (!project) {
      const error = new Error("Proyecto no encontrado");
      return res.status(404).json({ error: error.message });
    }

    try {
      //Creamos una nueva tarea
      const task = new Task(req.body);

      //le asiganmos a la task el id del proyecto
      task.project = project._id
      //le asignamos al projecto las multimples task
      project.tasks.push(task._id)

      //Guardamos esa tarea
      await task.save();
      //Guardamos esa tarea en su projecto
      await project.save()
      
      //Enviamos un response que la tarea fue creada con existo
      res.send("Tarea creada correctamente");
  
    } catch (error) {
      console.log(error);
    }
  };
}
