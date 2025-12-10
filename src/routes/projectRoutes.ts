import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskControler } from "../controllers/TaskController";
import { validateProjectExist } from "../middleware/project";

// Se crea el router
const router = Router();

//crear un proyecto
router.post(
  "/",
  //validacion en el servidor
  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La descripcion del proyecto es obligatoria"),
  handleInputErrors,
  ProjectController.createProject // si pasa la validacion se manda llamar a un controlador
);

// Nos trae todos los proyectos
router.get("/", ProjectController.getAllProjects);

// Nos trae el proyecto por su ID
router.get(
  "/:id",
  //params: valida que el id en la url sea valido para mongo
  param("id").isMongoId().withMessage("ID no valido"),
  handleInputErrors,
  ProjectController.getProjectByID
);

// Nos trae el proyecto por su ID
router.put(
  "/:id",
  //params: valida que el id en la url sea valido para mongo
  param("id").isMongoId().withMessage("ID no valido"),
  //validacion de datos correctos
  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La descripcion del proyecto es obligatoria"),
  handleInputErrors,
  ProjectController.updateProject
);

// Nos trae el proyecto por su ID
router.delete(
  "/:id",
  //params: valida que el id en la url sea valido para mongo
  param("id").isMongoId().withMessage("ID no valido"),
  handleInputErrors,
  ProjectController.deleteProject
);

/////////////////////////////////////////////

// Routes for task
router.post("/:projectId/tasks", 
  validateProjectExist, // middle para validar si el proyecto existe
  TaskControler.createTask); //Se creal la task
export default router;
