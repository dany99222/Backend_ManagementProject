import mongoose, { Schema, Document } from "mongoose";

// type-modelo de typescript
export type ProyectType = Document & {
  projetName: string;
  clientName: string;
  description: string;
};

// type-modelo para mongoose
const ProyectSchema: Schema = new Schema({
  proyectname: {
    type: String,
    requiered: true,
    trim: true,
  },
  clientName: {
    type: String,
    requiered: true,
    trim: true,
  },
  description: {
    type: String,
    requiered: true,
    trim: true,
  },
});

//Conectas el modelo con mongoose
const Proyect = mongoose.model<ProyectType>("Proyect", ProyectSchema);
export default Proyect;
