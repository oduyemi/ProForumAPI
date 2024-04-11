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
const bcrypt_1 = __importDefault(require("bcrypt"));
const adminModel_1 = __importDefault(require("../models/adminModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const postModel_1 = __importDefault(require("../models/postModel"));
const commentModel_1 = require("../models/commentModel");
const tagModel_1 = __importDefault(require("../models/tagModel"));
const router = express_1.default.Router();
router.put("/users/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        if (!req.session.user || req.session.user.userID.toString() !== userId) {
            return res.status(401).json({ message: "Unauthorized: User not logged in or unauthorized to perform this action" });
        }
        const { username, email, phone, bio, img } = req.body;
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (username)
            user.username = username;
        if (email)
            user.email = email;
        if (phone)
            user.phone = phone;
        if (bio)
            user.bio = bio;
        if (img)
            user.img = img;
        yield user.save();
        res.status(200).json({ message: "User details updated successfully" });
    }
    catch (error) {
        console.error("Error updating user details:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.put("/admin/:adminId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.params.adminId;
        const updatedAdminData = req.body;
        const requiredFields = ["fname", "lname", "email", "phone", "password"];
        const missingFields = requiredFields.filter(field => !(field in updatedAdminData));
        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
        }
        const updatedAdmin = yield adminModel_1.default.findByIdAndUpdate(adminId, updatedAdminData, { new: true });
        if (!updatedAdmin) {
            return res.status(404).json({ Message: "Admin not found" });
        }
        res.json({ data: updatedAdmin });
    }
    catch (error) {
        console.error("Error updating admin profile", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
}));
router.put("/users/:userId/resetpassword", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        if (!req.session.user || req.session.user.userID.toString() !== userId) {
            return res.status(401).json({ message: "Unauthorized: User not logged in or unauthorized to perform this action" });
        }
        const { oldPassword, newPassword, confirmNewPassword } = req.body;
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!newPassword !== confirmNewPassword) {
            return res.status(404).json({ message: "Both passwords must match!" });
        }
        const isPasswordMatch = yield bcrypt_1.default.compare(oldPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Incorrect old password" });
        }
        user.password = yield bcrypt_1.default.hash(newPassword, 10);
        yield user.save();
        res.status(200).json({ message: "Password reset successfully" });
    }
    catch (error) {
        console.error("Error resetting user password:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.put("/tags/:tagId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tagId = req.params.tagId;
        const { name } = req.body;
        const updatedTag = yield tagModel_1.default.findByIdAndUpdate(tagId, { name }, { new: true });
        if (!updatedTag) {
            return res.status(404).json({ message: "Tag not found" });
        }
        return res.status(200).json(updatedTag);
    }
    catch (error) {
        console.error("Error updating tag:", error);
        return res.status(500).json({ message: "Error updating tag" });
    }
}));
router.put("/posts/:postId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.postId;
        const { title, content, author } = req.body;
        const updatedPost = yield postModel_1.default.findByIdAndUpdate(postId, { title, content, author }, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json(updatedPost);
    }
    catch (error) {
        console.error("Error updating post:", error);
        return res.status(500).json({ message: "Error updating post" });
    }
}));
router.put("/comments/:commentId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = req.params.commentId;
        const { text, userId } = req.body;
        const updatedComment = yield commentModel_1.Comment.findByIdAndUpdate(commentId, { text, userId }, { new: true });
        if (!updatedComment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        return res.status(200).json(updatedComment);
    }
    catch (error) {
        console.error("Error updating comment:", error);
        return res.status(500).json({ message: "Error updating comment" });
    }
}));
exports.default = router;
