import { Router } from "express";
import { body } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";

// Se crea el router
const router = Router();

router.post(
  "/",
  //validacion en el servidor
  body("projetName")
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
router.get("/", ProjectController.getAllProjects);

export default router;
