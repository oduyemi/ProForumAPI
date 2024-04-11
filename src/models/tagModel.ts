import mongoose, { Schema, Document } from "mongoose";



export interface ITag extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  author: mongoose.Types.ObjectId;
}

const tagSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true
   }
});

const Tag = mongoose.model<ITag>("Tag", tagSchema);

export default Tag;
