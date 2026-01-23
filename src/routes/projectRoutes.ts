import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExist } from "../middleware/project";
import { hasAuthorization, validateTaskExist } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";

// Se crea el router
const router = Router();

//Todos los endpoints de este archivo utilizaran autheticate
router.use(authenticate);

// crear un proyecto
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
  ProjectController.createProject, // si pasa la validacion se manda llamar a un controlador
);

// Nos trae todos los proyectos
router.get("/", ProjectController.getAllProjects);

// Nos trae el proyecto por su ID
router.get(
  "/:id",
  //params: valida que el id en la url sea valido para mongo
  param("id").isMongoId().withMessage("ID no valido"),
  handleInputErrors,
  ProjectController.getProjectByID,
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
  ProjectController.updateProject,
);

// Nos trae el proyecto por su ID
router.delete(
  "/:id",
  //params: valida que el id en la url sea valido para mongo
  param("id").isMongoId().withMessage("ID no valido"),
  handleInputErrors,
  ProjectController.deleteProject,
);

/////////////////////////////////////////////

// Routes for task

// Se crea una tarea en una tarea en un proyecto determinado y se anade el proyecto a la tarea
router.post(
  "/:projectId/tasks",
  validateProjectExist, // middle para validar si el proyecto existe
  //validacion de los campos
  hasAuthorization,
  body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La descripcion es oblogatoria es obligatorio"),
  handleInputErrors, //mostramos los errores
  TaskController.createTask, //Creamos la tarea
);

// Obsetener todas las tareas de un proyecto
router.get(
  "/:projectId/tasks",
  validateProjectExist, // middle para validar si el proyecto existe
  //validacion de los campos
  TaskController.getProyectTasks,
);
// En las rutas donde haya un taskId se ejecutara el siguiente funcion
router.param("taskId", validateTaskExist);
// Obtener tareas por id y validar que sea de su projecto
router.get(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("ID no valido"),
  validateProjectExist,
  handleInputErrors,
  TaskController.getTaskById,
);

// Actualizar tareas
router.put(
  "/:projectId/tasks/:taskId",
  validateProjectExist,
  hasAuthorization,
  //Validar que sea u id valido
  param("taskId").isMongoId().withMessage("ID no valido"),
  //validacion de los campos
  body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La descripcion es oblogatoria es obligatorio"),
  handleInputErrors,
  TaskController.updateTask,
);

// Eliminar tareas en tareas
//Eliminar la referencia de esa tarea en su proyecto
router.delete(
  "/:projectId/tasks/:taskId",
  validateProjectExist,
  hasAuthorization,
  param("taskId").isMongoId().withMessage("ID no valido"),
  handleInputErrors,
  TaskController.deleteTask,
);

// End point para actualizar los esatados de las tareas
router.post(
  "/:projectId/tasks/:taskId/status",
  param("taskId").isMongoId().withMessage("ID no valido"),
  body("status").notEmpty().withMessage("El estado es obligatorio"),
  validateProjectExist,
  handleInputErrors,
  TaskController.updateStatus,
);

// RUTAS PARA LOS COLABORADORES

// Enocntar  aun suuario
router.post(
  "/:projectId/team/find",
  body("email").isEmail().toLowerCase().withMessage("E-Mail no valido"),
  handleInputErrors,
  TeamMemberController.findMemberByEmail,
);

router.get(
  "/:projectId/team",
  validateProjectExist,
  TeamMemberController.getProjectTeam,
);

router.post(
  "/:projectId/team",
  validateProjectExist,
  body("id").isMongoId().withMessage("ID no valido"),
  handleInputErrors,
  TeamMemberController.addMemberById,
);

router.delete(
  "/:projectId/team/:userId",
  validateProjectExist,
  param("userId").isMongoId().withMessage("ID no valido"),
  handleInputErrors,
  TeamMemberController.removeMemberById,
);
export default router;
