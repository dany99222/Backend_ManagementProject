import type { Request, Response, NextFunction } from "express";
import{validationResult}from 'express-validator'

export const handleInputErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

    let errors = validationResult(req)

    if(!errors.isEmpty()){
return res.status(400).json({errors: errors.array() })
    }
    //Si no se cumple la validacion anterior pasa a la siguiente (en el router)
    next()
};
