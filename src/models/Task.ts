import mongoose, { Schema, Document, Types } from "mongoose";
import Note from "./Note";

const taskStatus = {
  PENDING: "pending",
  ON_HOLD: "onHold",
  IN_PROGRESS: "inProgress",
  UNDER_REVIEW: "underReview",
  COMPLETED: "completed",
} as const; // Solo se pueden leer no modificar

//con esto solo podemos elegir las opciones de la taskStatus
export type TaskStatus = (typeof taskStatus)[keyof typeof taskStatus];

// type-modelo de typescript
export interface InterfaceTask extends Document {
  name: string;
  description: string;
  project: Types.ObjectId; //Una tarea a un proyecto
  status: TaskStatus;
  completedBy: {
    user: Types.ObjectId;
    status: TaskStatus;
  }[];
  notes: Types.ObjectId[];
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
      ref: "Proyect",
    },
    status: {
      type: String,
      //enum se utiliza para un conjunto limitado de valores
      enum: Object.values(taskStatus),
      default: taskStatus.PENDING,
    },
    completedBy: [
      {
        user: {
          type: Types.ObjectId,
          ref: "User",
          default: null,
        },
        status: {
          type: String,
          //enum se utiliza para un conjunto limitado de valores
          enum: Object.values(taskStatus),
          default: taskStatus.PENDING,
        },
      },
    ],
    notes: [
      {
        type: Types.ObjectId,
        ref: "Note",
      },
    ],
  },
  {
    //crea dos campos para almacenar fecha de creacion y actualizacion
    timestamps: true,
  },
);

// Middlewares
TaskSchema.pre("deleteOne", { document: true }, async function () {
  const taskId = this._id;
  if (!taskId) return;
  await Note.deleteMany({ task: taskId });
});

const Task = mongoose.model<InterfaceTask>("Task", TaskSchema);
export default Task;
