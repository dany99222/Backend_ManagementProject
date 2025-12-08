import colors from "colors";
import server from "./server";

const port = process.env.PORT || 4000;

//Aqui se inicia el servidor 
server.listen(port, () => {
  console.log(colors.magenta.bold(`REST API funcionando en el puerto ${port}`));
});
