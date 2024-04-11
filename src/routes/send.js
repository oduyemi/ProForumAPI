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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = require("bcrypt");
const adminModel_1 = __importDefault(require("../models/adminModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const postModel_1 = __importDefault(require("../models/postModel"));
const commentModel_1 = require("../models/commentModel");
const likeModel_1 = __importDefault(require("../models/likeModel"));
const dislikeModel_1 = __importDefault(require("../models/dislikeModel"));
const tagModel_1 = __importDefault(require("../models/tagModel"));
const router = express_1.default.Router();
require("dotenv").config();
// Middleware to verify user authentication
const authenticateUser = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: "User authentication required" });
    }
    next();
};
// Middleware to check if the user has already liked or disliked the post/comment
const checkAlreadyLikedOrDisliked = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.session || !req.session.user || !req.session.user.userID) {
        return res.status(401).json({ message: "User authentication required" });
    }
    const { userID } = req.session.user;
    const { postID, commentID } = req.body;
    if (postID) {
        const existingLike = yield likeModel_1.default.findOne({ postID, userID });
        const existingDislike = yield dislikeModel_1.default.findOne({ postID, userID });
        if (existingLike || existingDislike) {
            return res.status(400).json({ message: "You have already liked or disliked this post" });
        }
    }
    else if (commentID) {
        const existingLike = yield commentModel_1.CommentLike.findOne({ commentID, userID });
        const existingDislike = yield commentModel_1.CommentDislike.findOne({ commentID, userID });
        if (existingLike || existingDislike) {
            return res.status(400).json({ message: "You have already liked or disliked this comment" });
        }
    }
    next();
});
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, phone, password, cpwd, bio, role, img } = req.body;
        if (![username, email, phone, password, cpwd, bio, role, img].every(field => field)) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== cpwd) {
            return res.status(400).json({ message: "Both passwords must match" });
        }
        const existingUserByEmail = yield userModel_1.default.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const existingUserByUsername = yield userModel_1.default.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).json({ message: "Username not available" });
        }
        const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
        const newUser = new userModel_1.default({ username, email, phone, password: hashedPassword, bio, role, img });
        yield newUser.save();
        const token = jsonwebtoken_1.default.sign({
            userID: newUser._id,
            email: newUser.email,
            username: newUser.username
        }, process.env.JWT_SECRET);
        const userSession = {
            userID: newUser._id,
            username,
            email,
            phone,
            bio,
            role,
            img
        };
        req.session.user = userSession;
        return res.status(201).json({
            message: "User registered successfully",
            token,
            nextStep: "/next-login-page"
        });
    }
    catch (error) {
        console.error("Error during user registration:", error);
        return res.status(500).json({ message: "Error registering user" });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username, password } = req.body;
        if ((!email && !username) || !password) {
            return res.status(400).json({ message: "Email/Username and password are required" });
        }
        let user = null;
        if (email) {
            user = yield userModel_1.default.findOne({ email });
        }
        if (!user && username) {
            user = yield userModel_1.default.findOne({ username });
        }
        if (!user) {
            return res.status(401).json({ message: "Invalid email/username or password" });
        }
        const isPasswordMatch = yield (0, bcrypt_1.compare)(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid email/username or password" });
        }
        const token = jsonwebtoken_1.default.sign({
            userID: user._id,
            email: user.email
        }, process.env.JWT_SECRET || "default_secret");
        const userSession = {
            userID: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            bio: user.bio,
            role: user.role,
            img: user.img
        };
        req.session.user = userSession;
        return res.status(200).json({
            message: "User login successful!.",
            nextStep: "/next-dashboard",
            token,
        });
    }
    catch (error) {
        console.error("Error during user login:", error);
        return res.status(500).json({ message: "Error logging in user" });
    }
}));
router.post("/admin/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fname, lname, email, phone, password, cpwd } = req.body;
        if (![fname, lname, email, phone, password, cpwd].every((field) => field)) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== cpwd) {
            return res.status(400).json({ message: "Both passwords must match!" });
        }
        const existingAdmin = yield adminModel_1.default.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
        const newAdmin = new adminModel_1.default({ fname, lname, email, phone, password: hashedPassword });
        yield newAdmin.save();
        // Access token
        const token = jsonwebtoken_1.default.sign({
            adminID: newAdmin._id,
            email: newAdmin.email
        }, process.env.JWT_SECRET);
        const adminSession = {
            adminID: newAdmin._id,
            fname,
            lname,
            email,
            phone
        };
        req.session.admin = adminSession;
        return res.status(201).json({
            message: "Admin registered successfully.",
            token,
            nextStep: "/next-admin-login-page",
        });
    }
    catch (error) {
        console.error("Error during admin registration:", error);
        return res.status(500).json({ message: "Error registering admin" });
    }
}));
router.post("/admin/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        try {
            const admin = yield adminModel_1.default.findOne({ email });
            if (!admin) {
                return res.status(401).json({ message: "Email not registered. Please register first." });
            }
            const isPasswordMatch = yield (0, bcrypt_1.compare)(password, admin.password);
            if (!isPasswordMatch) {
                return res.status(401).json({ message: "Incorrect email or password" });
            }
            const token = jsonwebtoken_1.default.sign({
                adminID: admin._id,
                email: admin.email
            }, process.env.JWT_SECRET || "default_secret");
            const adminSession = {
                adminID: admin._id,
                fname: admin.fname,
                lname: admin.lname,
                email: admin.email,
                phone: admin.phone,
            };
            req.session.admin = adminSession;
            return res.status(200).json({
                message: "Admin login successful!.",
                nextStep: "/next-admin-dashboard",
                token,
            });
        }
        catch (error) {
            console.error("Error during admin login:", error);
            return res.status(500).json({ message: "Error logging in admin" });
        }
    }
    catch (error) {
        console.error("Error during admin login:", error);
        return res.status(500).json({ message: "Error logging in admin" });
    }
}));
router.post("/post", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, author, tags } = req.body;
        if (![title, content, author, tags].every(field => field)) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newPost = new postModel_1.default({ title, content, author, tags });
        yield newPost.save();
        return res.status(201).json({ message: "Post created successfully" });
    }
    catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ message: "Error creating post" });
    }
}));
router.post("/tag", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name is required for the tag" });
        }
        const newTag = new tagModel_1.default({ name });
        yield newTag.save();
        return res.status(201).json({ message: "Tag created successfully" });
    }
    catch (error) {
        console.error("Error creating tag:", error);
        return res.status(500).json({ message: "Error creating tag" });
    }
}));
router.post("/comment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, author, postID } = req.body;
        if (![content, author, postID].every(field => field)) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newComment = new commentModel_1.Comment({ content, author, postID });
        yield newComment.save();
        return res.status(201).json({ message: "Comment created successfully" });
    }
    catch (error) {
        console.error("Error creating comment:", error);
        return res.status(500).json({ message: "Error creating comment" });
    }
}));
router.post("/post/like", authenticateUser, checkAlreadyLikedOrDisliked, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postID, userID } = req.body;
        if (!postID || !userID) {
            return res.status(400).json({ message: "Post ID and user ID are required" });
        }
        const existingLike = yield likeModel_1.default.findOne({ postID, userID });
        if (existingLike) {
            yield likeModel_1.default.deleteOne({ postID, userID });
            return res.status(200).json({ message: "Like removed successfully" });
        }
        const newLike = new likeModel_1.default({ postID, userID });
        yield newLike.save();
        return res.status(201).json({ message: "Post liked successfully" });
    }
    catch (error) {
        console.error("Error handling post like:", error);
        return res.status(500).json({ message: "Error handling post like" });
    }
}));
router.post("/post/dislike", authenticateUser, checkAlreadyLikedOrDisliked, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postID, userID } = req.body;
        if (!postID || !userID) {
            return res.status(400).json({ message: "Post ID and user ID are required" });
        }
        const existingDislike = yield dislikeModel_1.default.findOne({ postID, userID });
        if (existingDislike) {
            yield dislikeModel_1.default.deleteOne({ postID, userID });
            return res.status(200).json({ message: "Dislike removed successfully" });
        }
        const newDislike = new dislikeModel_1.default({ postID, userID });
        yield newDislike.save();
        return res.status(201).json({ message: "Post disliked successfully" });
    }
    catch (error) {
        console.error("Error handling post dislike:", error);
        return res.status(500).json({ message: "Error handling post dislike" });
    }
}));
router.post("/comment/like", authenticateUser, checkAlreadyLikedOrDisliked, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentID, userID } = req.body;
        if (!commentID || !userID) {
            return res.status(400).json({ message: "Comment ID and user ID are required" });
        }
        const existingLike = yield commentModel_1.CommentLike.findOne({ commentID, userID });
        if (existingLike) {
            yield likeModel_1.default.deleteOne({ commentID, userID });
            return res.status(200).json({ message: "Comment like removed successfully" });
        }
        const newLike = new commentModel_1.CommentLike({ commentID, userID });
        yield newLike.save();
        return res.status(201).json({ message: "Comment liked successfully" });
    }
    catch (error) {
        console.error("Error handling comment like:", error);
        return res.status(500).json({ message: "Error handling comment like" });
    }
}));
router.post("/comment/dislike", authenticateUser, checkAlreadyLikedOrDisliked, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentID, userID } = req.body;
        if (!commentID || !userID) {
            return res.status(400).json({ message: "Comment ID and user ID are required" });
        }
        const existingDislike = yield commentModel_1.CommentDislike.findOne({ commentID, userID });
        if (existingDislike) {
            yield dislikeModel_1.default.deleteOne({ commentID, userID });
            return res.status(200).json({ message: "Comment dislike removed successfully" });
        }
        const newDislike = new commentModel_1.CommentDislike({ commentID, userID });
        yield newDislike.save();
        return res.status(201).json({ message: "Comment disliked successfully" });
    }
    catch (error) {
        console.error("Error handling comment dislike:", error);
        return res.status(500).json({ message: "Error handling comment dislike" });
    }
}));
exports.default = router;
