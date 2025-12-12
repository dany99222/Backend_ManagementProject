import type { Request, Response, NextFunction } from "express";
import Task, { InterfaceTask } from "../models/Task";

//Agrega al objeto req propiedades personalizadas
declare global {
  namespace Express {
    interface Request {
        task: InterfaceTask
    }
  }
}

export async function validateTaskExist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    //Extraemos este parametro de la url
    const { taskId } = req.params;

    //Nos traemos el proyecto de la bd
    const task = await Task.findById(taskId);

    //Validamos si el proyecto existe en la bd
    if (!task) {
      const error = new Error("Tarea no encontrada");
      return res.status(404).json({ error: error.message });
    }

    req.task = task

    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
}
