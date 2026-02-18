🛠️ ProjectManagement — Backend

API REST para la gestión de proyectos y tareas, construida con Node.js, Express y MongoDB.


📖 Descripción
Backend de la aplicación ProjectManagement. Expone una API REST que gestiona autenticación de usuarios (JWT), proyectos, tareas y envío de correos electrónicos. Construido con Express 5, TypeScript y MongoDB mediante Mongoose.

🚀 Tecnologías utilizadas
TecnologíaVersiónDescripciónNode.js>= 18Entorno de ejecuciónTypeScript5.9Tipado estáticoExpress5Framework HTTPMongoDB + Mongoose9Base de datos NoSQLJSON Web Token9AutenticaciónBcrypt6Hash de contraseñasNodemailer7Envío de correosExpress Validator7Validación de datosMorgan1.10Logger HTTPCORS2.8Control de origen cruzadoDotenv17Variables de entorno

📁 Estructura del proyecto
backend/
├── src/
│   ├── config/         # Configuración de base de datos y entorno
│   ├── controllers/    # Controladores y lógica de negocio
│   ├── emails/         # Plantillas y envío de correos
│   ├── middleware/     # Middlewares (auth, validación)
│   ├── models/         # Modelos Mongoose
│   ├── routes/         # Definición de rutas
│   ├── utils/          # Funciones utilitarias
│   ├── index.ts        # Punto de entrada
│   └── server.ts       # Configuración del servidor
├── dist/               # Build compilado
├── tsconfig.json
└── package.json

⚙️ Instalación y uso
Prerrequisitos

Node.js >= 18
MongoDB (local o Atlas)
npm

Pasos
bash# 1. Clonar el repositorio
git clone https://github.com/dany99222/backend.git
cd backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Edita el archivo .env con tus valores

# 4. Iniciar en modo desarrollo
npm run dev
Scripts disponibles
bashnpm run dev       # Inicia con nodemon + ts-node (modo desarrollo)
npm run build     # Compila TypeScript a JavaScript
npm start         # Ejecuta el build de producción

🌍 Variables de entorno
Crea un archivo .env en la raíz del proyecto:
envPORT=4000
MONGO_URI=mongodb://localhost:27017/projectmanagement
JWT_SECRET=tu_secreto_jwt
FRONTEND_URL=http://localhost:5173

# Nodemailer
SMTP_HOST=smtp.ejemplo.com
SMTP_PORT=587
SMTP_USER=tu@email.com
SMTP_PASS=tu_contraseña

🔗 Endpoints principales
MétodoRutaDescripciónPOST/api/auth/registerRegistro de usuarioPOST/api/auth/loginInicio de sesiónGET/api/projectsListar proyectosPOST/api/projectsCrear proyectoGET/api/projects/:id/tasksListar tareasPOST/api/projects/:id/tasksCrear tarea

🔐 Autenticación
La API usa JWT (JSON Web Tokens). Para acceder a rutas protegidas, incluye el token en el header:
Authorization: Bearer <tu_token>

👤 Autor
dany99222

GitHub: @dany99222


📄 Licencia
ISC
