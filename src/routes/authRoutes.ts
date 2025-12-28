import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

// Ruta para crear cuenta
router.post(
  "/create-account",
  body("name").notEmpty().withMessage("El nombre no puede ir vacio"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password es muy corto, minimo 8 caracteres"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Los Passwords no son Iguales");
    }
    return true;
  }),
  body("email").isEmail().withMessage("Email no Valido "),
  handleInputErrors,
  AuthController.createAccount
);

// Ruta para confirmar cuenta
router.post(
  "/confirm-account",
  body("token").notEmpty().withMessage("El token no puede ir vacio"),
  handleInputErrors,
  AuthController.confirmAccount
);

// Ruta para confirmar cuenta
router.post(
  "/login",
  body("email").notEmpty().withMessage("El emial npo puede ir vacio"),
  body("password")
    .notEmpty()
    .withMessage("El password no puede ir vacio"),
  handleInputErrors,
  AuthController.login
);

// Ruta para enviar un nuevo token
router.post(
  "/request-code",
  body("email").notEmpty().withMessage("E-mail no valido"),
  handleInputErrors,
  AuthController.requestConfirmationCode
);

export default router;
