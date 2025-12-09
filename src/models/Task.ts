import mongoose, { Schema, Document } from "mongoose";

// type-modelo de typescript
export interface InterfaceTask extends Document {
  name: string;
  description: string;
}

//Modelo de mongose
export const TaskSchema: Schema = new Schema({
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
});

const Task = mongoose.model<InterfaceTask>("Task", TaskSchema);
export default Task;
