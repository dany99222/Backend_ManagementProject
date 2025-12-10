import type { Request, Response } from "express";

export class TaskControler {
  // Crear tarea
  static createProject = async (req: Request, res: Response) => {

    //Extraemos este parametro de la url
    const {projectId} = req.params
    console.log(projectId)

    try {

    } catch (error) {
        console.log(error)
    }
  };
}
