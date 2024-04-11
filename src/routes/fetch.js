"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminModel_1 = __importDefault(require("../models/adminModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const postModel_1 = __importDefault(require("../models/postModel"));
const commentModel_1 = require("../models/commentModel");
const likeModel_1 = __importDefault(require("../models/likeModel"));
const dislikeModel_1 = __importDefault(require("../models/dislikeModel"));
const tagModel_1 = __importDefault(require("../models/tagModel"));
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.json({ message: "Welcome to ProForum API" });
});
router.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find();
        if (users.length === 0) {
            res.status(404).json({ Message: "Users not available" });
        }
        else {
            res.json({ data: users });
        }
    }
    catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
}));
router.get("/users/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ Message: "User not found" });
        }
        else {
            res.json({ data: user });
        }
    }
    catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
}));
router.get("/admin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admins = yield adminModel_1.default.find();
        if (admins.length === 0) {
            res.status(404).json({ Message: "Admins not available" });
        }
        else {
            res.json({ data: admins });
        }
    }
    catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
}));
router.get("/admin/:adminId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.params.adminId;
        const admin = yield adminModel_1.default.findById(adminId);
        if (!admin) {
            res.status(404).json({ Message: "Admin not found" });
        }
        else {
            res.json({ data: admin });
        }
    }
    catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
}));
router.get("/posts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield postModel_1.default.find();
        return res.status(200).json(posts);
    }
    catch (error) {
        console.error("Error retrieving posts:", error);
        return res.status(500).json({ message: "Error retrieving posts" });
    }
}));
router.get("/posts/:postId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.courseId;
        const post = yield postModel_1.default.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json(post);
    }
    catch (error) {
        console.error("Error retrieving post:", error);
        return res.status(500).json({ message: "Error retrieving post" });
    }
}));
router.get("/tags", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tags = yield tagModel_1.default.find();
        return res.status(200).json(tags);
    }
    catch (error) {
        console.error("Error retrieving tags:", error);
        return res.status(500).json({ message: "Error retrieving tags" });
    }
}));
router.get("/tags/:tagId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tagId = req.params.tagId;
        const tag = yield tagModel_1.default.findById(tagId);
        if (!tag) {
            return res.status(404).json({ message: "Tag not found" });
        }
        return res.status(200).json(tag);
    }
    catch (error) {
        console.error("Error retrieving tag:", error);
        return res.status(500).json({ message: "Error retrieving tag" });
    }
}));
router.get("/comments", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield commentModel_1.Comment.find();
        return res.status(200).json(comments);
    }
    catch (error) {
        console.error("Error retrieving comments:", error);
        return res.status(500).json({ message: "Error retrieving comments" });
    }
}));
router.get("/comments/:commentId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = req.params.commentId;
        const comment = yield commentModel_1.Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        return res.status(200).json(comment);
    }
    catch (error) {
        console.error("Error retrieving comment:", error);
        return res.status(500).json({ message: "Error retrieving comment" });
    }
}));
router.get("/posts/likes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield postModel_1.default.find().populate('likes');
        return res.status(200).json(posts);
    }
    catch (error) {
        console.error("Error retrieving posts with likes:", error);
        return res.status(500).json({ message: "Error retrieving posts with likes" });
    }
}));
router.get("/posts/dislikes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield postModel_1.default.find().populate('dislikes');
        return res.status(200).json(posts);
    }
    catch (error) {
        console.error("Error retrieving posts with dislikes:", error);
        return res.status(500).json({ message: "Error retrieving posts with dislikes" });
    }
}));
router.get("/posts/:postId/likes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.postId;
        const likes = yield likeModel_1.default.find({ postID: postId });
        return res.status(200).json(likes);
    }
    catch (error) {
        console.error("Error retrieving likes for post:", error);
        return res.status(500).json({ message: "Error retrieving likes for post" });
    }
}));
router.get("/posts/:postId/dislikes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.postId;
        const dislikes = yield dislikeModel_1.default.find({ postID: postId });
        return res.status(200).json(dislikes);
    }
    catch (error) {
        console.error("Error retrieving dislikes for post:", error);
        return res.status(500).json({ message: "Error retrieving dislikes for post" });
    }
}));
router.get("/comments/:commentId/likes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = req.params.commentId;
        const likes = yield commentModel_1.CommentLike.find({ commentID: commentId });
        return res.status(200).json(likes);
    }
    catch (error) {
        console.error("Error retrieving likes for comment:", error);
        return res.status(500).json({ message: "Error retrieving likes for comment" });
    }
}));
router.get("/comments/:commentId/dislikes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = req.params.commentId;
        const dislikes = yield commentModel_1.CommentDislike.find({ commentID: commentId });
        return res.status(200).json(dislikes);
    }
    catch (error) {
        console.error("Error retrieving idslikes for comment:", error);
        return res.status(500).json({ message: "Error retrieving dislikes for comment" });
    }
}));
exports.default = router;
