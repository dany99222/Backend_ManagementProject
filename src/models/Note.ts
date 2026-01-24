import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";

// Type script
 export interface IntefaceNote extends Document {
  content: string;
  createdBy: Types.ObjectId;
  task: Types.ObjectId;
}

const NoteSchema: Schema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    Task: {
      type: Types.ObjectId,
      ref: "Task",
      required: true,
    },
  },
  { timestamps: true },
);

const Note = mongoose.model<IntefaceNote>("note", NoteSchema);
export default Note;