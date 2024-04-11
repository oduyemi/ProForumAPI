"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentDislike = exports.CommentLike = exports.Comment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    postID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    likes: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User"
        }],
    dislikes: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User"
        }],
    date: {
        type: Date, default: Date.now
    },
});
const commentLikeSchema = new mongoose_1.default.Schema({
    userID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    commentID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Comment",
        required: true
    }
});
const commentDislikeSchema = new mongoose_1.default.Schema({
    userID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    commentID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Comment",
        required: true
    }
});
// Export schemas
const Comment = mongoose_1.default.model("Comment", commentSchema);
exports.Comment = Comment;
const CommentLike = mongoose_1.default.model("CommentLike", commentLikeSchema);
exports.CommentLike = CommentLike;
const CommentDislike = mongoose_1.default.model("CommentDislike", commentDislikeSchema);
exports.CommentDislike = CommentDislike;
