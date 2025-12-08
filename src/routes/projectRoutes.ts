import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";

// Se crea el router
const router = Router();

//Aqui se manda llamar a un controlador
router.post("/", ProjectController.createProject);
router.get("/", ProjectController.getAllProjects);

export default router;
