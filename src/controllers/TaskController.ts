import type { Request, Response } from "express";
import Task from "../models/Task";

export class TaskController {
  // Crear tarea en su proyecto
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
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  //Obtener tareas de un determinado proyecto
  static getProyectTasks = async (req: Request, res: Response) => {
    try {
      // consultamos a la bd las tareas de dicho proyecto
      //populate: sirve para traernos la informacion del otro documento
      const tasks = await Task.find({ project: req.project._id }).populate(
        "project",
      );
      res.json(tasks); //Nos genera una respuesta de las tareas
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
      console.log(error);
    }
  };

  // Obtener tareas por su ID
  static getTaskById = async (req: Request, res: Response) => {
    try {
      // Validacion para que la tarea le pertenezca a ese proyecto
      if (req.task.project.toString() !== req.project._id.toString()) {
        const error = new Error("Accion no valida");
        return res.status(400).json({ error: error.message });
      }
      const task = await Task.findById(req.task._id).populate({path: 'completedBy', select: 'id name email'})

      // en caso de que exista repondemos el objeto
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  // Actualizar tareas
  static updateTask = async (req: Request, res: Response) => {
    try {
      // Validacion para que la tarea le pertenezca a ese proyecto
      if (req.task.project.toString() !== req.project._id.toString()) {
        const error = new Error("Accion no valida");
        return res.status(400).json({ error: error.message });
      }

      req.task.name = req.body.name;
      req.task.description = req.body.description;

      await req.task.save();

      // en caso de que exista repondemos el objeto
      res.send("tarea Actualizada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  // Eliminar tareas en tareas
  //Eliminar la referencia de esa tarea en su proyecto
  static deleteTask = async (req: Request, res: Response) => {
    try {
      //Elimina la tarea del modelo de project en su array de projects
      req.project.tasks = req.project.tasks.filter(
        (task) => task.toString() !== req.task._id.toString(),
      );

      // Esto elimina la tarea del modelo de tareas en la bd
      //Guarda el proyecto actualizado
      await Promise.allSettled([req.task.deleteOne(), req.project.save()]);

      // en caso de que exista repondemos el objeto
      res.send("tarea Eliminada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  // Actualizar el estado de status
  static updateStatus = async (req: Request, res: Response) => {
    try {
      //Revisamos el estado
      const { status } = req.body;
       req.task.status = status;

       const data = {
        user: req.user._id,
        status
       }
       
     req.task.completedBy.push(data)
      await req.task.save();
      res.send("Tarea status actualizado");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
