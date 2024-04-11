import mongoose, { Schema, Document } from "mongoose";

export interface ILike extends Document {
  userId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
}

const likeSchema: Schema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
        },
    postId: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: "Post", 
         required: true
        }
});

const Like = mongoose.model<ILike>("Like", likeSchema);

export default Like;
