import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import Task, { InterfaceTask } from "./Task";
import { InterfaceUser } from "./User";
import Note from "./Note";

// type-modelo de typescript
export interface InterfaceProyect extends Document {
  projectName: string;
  clientName: string;
  description: string;
  tasks: PopulatedDoc<InterfaceTask & Document>[]; // un proyecto mcuhas tareas
  manager: PopulatedDoc<InterfaceUser & Document>;
  team: PopulatedDoc<InterfaceUser & Document>[];
}

// type-modelo para mongoose
const ProyectSchema: Schema = new Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    tasks: [
      //Un proyecto muchas atreas
      {
        type: Types.ObjectId,
        ref: "Task",
      },
    ],
    manager: {
      type: Types.ObjectId,
      ref: "User",
    },
    team: [
      //Un proyecto muchas atreas
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    //crea dos campos para almacenar fecha de creacion y actualizacion
    timestamps: true,
  },
);

// Middlewares
ProyectSchema.pre("deleteOne", { document: true }, async function () {
  const projectId = this._id;
  if (!projectId) return;

  const tasks = await Task.find({ project: projectId });

  for(const task of tasks) {
    await Note.deleteMany({ task: task._id });
  }
  await Note.deleteMany({ project: projectId });
});

//Conectas el modelo con mongoose
const Proyect = mongoose.model<InterfaceProyect>("Proyect", ProyectSchema);
export default Proyect;
