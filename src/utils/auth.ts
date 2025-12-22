import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  //hasheamos el password
  //Genera un numero aleatorio con el password
  const salt = await bcrypt.genSalt(10);
  //   convina el hash con el numero para mas seguridad
  return await bcrypt.hash(password, salt);
};
