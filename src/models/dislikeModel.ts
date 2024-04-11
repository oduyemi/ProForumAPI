import mongoose, { Schema, Document } from "mongoose";

export interface IDislike extends Document {
  userId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
}

const dislikeSchema: Schema = new mongoose.Schema({
  userId: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: "User", 
     required: true },
  postId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Post", 
    required: true }
});

const Dislike = mongoose.model<IDislike>("Dislike", dislikeSchema);

export default Dislike;
