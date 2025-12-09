import mongoose, { Schema, Document } from "mongoose";

// type-modelo de typescript
export type ProyectType = Document & {
  projectName: string;
  clientName: string;
  description: string;
};

// type-modelo para mongoose
const ProyectSchema: Schema = new Schema({
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
});

//Conectas el modelo con mongoose
const Proyect = mongoose.model<ProyectType>("Proyect", ProyectSchema);
export default Proyect;
