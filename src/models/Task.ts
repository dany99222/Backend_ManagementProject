import mongoose, { Schema, Document, Types } from "mongoose";

// type-modelo de typescript
export interface InterfaceTask extends Document {
  name: string;
  description: string;
  project: Types.ObjectId; //Una tarea a un proyecto
}

//Modelo de mongose
export const TaskSchema: Schema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    project: {
      //Una tarea a un proyecto
      type: Types.ObjectId,
      ref: "Project",
    },
  },
  {
    //crea dos campos para almacenar fecha de creacion y actualizacion
    timestamps: true,
  }
);

const Task = mongoose.model<InterfaceTask>("Task", TaskSchema);
export default Task;
