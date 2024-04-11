import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  _id: mongoose.Types.ObjectId;
  content: string;
  author: mongoose.Types.ObjectId;
  postID: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  dislikes: mongoose.Types.ObjectId[];
  date: Date;
}

const commentSchema: Schema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  postID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  date: { 
    type: Date, default: Date.now 
  },
});

// CommentLike Schema
export interface ICommentLike extends Document {
  userID: mongoose.Types.ObjectId;
  commentID: mongoose.Types.ObjectId;
}

const commentLikeSchema: Schema = new mongoose.Schema({
    userID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
        },
    commentID: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: "Comment", 
         required: true
        }
});

// CommentDislike Schema
export interface ICommentDislike extends Document {
  userID: mongoose.Types.ObjectId;
  commentID: mongoose.Types.ObjectId;
}

const commentDislikeSchema: Schema = new mongoose.Schema({
  userID: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: "User", 
     required: true 
  },
  commentID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Comment", 
    required: true 
  }
});

// Export schemas
const Comment = mongoose.model<IComment>("Comment", commentSchema);
const CommentLike = mongoose.model<ICommentLike>("CommentLike", commentLikeSchema);
const CommentDislike = mongoose.model<ICommentDislike>("CommentDislike", commentDislikeSchema);

export { Comment, CommentLike, CommentDislike };
