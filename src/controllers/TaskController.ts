import type { Request, Response } from "express";
import Task from "../models/Task";

export class TaskControler {
  // Crear tarea
  static createTask = async (req: Request, res: Response) => {
    // el en middleware se hace la validacion de que el proyecto exista
    //Ahi se guarda informacion del proyecto en el req.proyect
    //Se acceden a los valores de del projecto con: project.

    try {
      //Creamos una nueva tarea
      const task = new Task(req.body);

      //le asiganmos a la task el id del proyecto
      task.project = req.project._id;
      //le asignamos al projecto las multimples task
      req.project.tasks.push(task._id);

      // Guardamos tareas y proyectos 
      await Promise.allSettled([task.save(), req.project.save()]);

      //Enviamos un response que la tarea fue creada con existo
      res.send("Tarea creada correctamente");
    } catch (error) {
      console.log(error);
    }
  };
}
