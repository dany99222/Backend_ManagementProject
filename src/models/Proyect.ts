import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { InterfaceTask } from "./Task";

// type-modelo de typescript
export interface InterfaceProyect extends Document {
  projectName: string;
  clientName: string;
  description: string;
  tasks: PopulatedDoc<InterfaceTask & Document>[]; // un proyecto mcuhas tareas
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
  },
  {
    //crea dos campos para almacenar fecha de creacion y actualizacion
    timestamps: true,
  }
);

//Conectas el modelo con mongoose
const Proyect = mongoose.model<InterfaceProyect>("Proyect", ProyectSchema);
export default Proyect;
