import express, { Request, Response } from "express";
import { Types } from "mongoose";
import Admin from "../models/adminModel";
import User from "../models/userModel";
import Post from "../models/postModel";
import { Comment } from "../models/commentModel";
import Tag from "../models/tagModel";


const router = express.Router();


router.delete("/tags/:tagId/delete", async (req, res) => {
    try {
        const tagId = req.params.tagId;
        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }

        const tag = await Tag.findById(tagId);
        if (!tag) {
            return res.status(404).json({ message: "Tag not found" });
        }

        const tagAuthor = Types.ObjectId.isValid(tag.author) ? tag.author.toString() : tag.author;
        if (tagAuthor !== req.session.user._id) {
            return res.status(401).json({ message: "Unauthorized: User not authorized to delete this tag" });
        }

        await Tag.findByIdAndDelete(tagId);
        res.status(200).json({ message: "Tag deleted successfully" });
    } catch (error) {
        console.error("Error deleting tag:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.delete("/posts/:postId/delete", async (req: Request, res: Response) => {
    try {
        const postId = req.params.postId;
        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const postAuthor = Types.ObjectId.isValid(post.author) ? post.author.toString() : post.author;
        if (postAuthor !== req.session.user._id) {
            return res.status(401).json({ message: "Unauthorized: User not authorized to delete this post" });
        }

        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.delete("/comments/:commentId/delete", async (req: Request, res: Response) => {
    try {
        const commentId = req.params.commentId;
        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const commentAuthor = Types.ObjectId.isValid(comment.author) ? comment.author.toString() : comment.author;
        if (commentAuthor !== req.session.user._id) {
            return res.status(401).json({ message: "Unauthorized: User not authorized to delete this comment" });
        }

        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.delete("/users/:userId/delete", async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!req.session.user || req.session.user.userID.toString() !== userId) {
            return res.status(401).json({ message: "Unauthorized: User not logged in or unauthorized to perform this action" });
        }       

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndDelete(userId);
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
            }
        });
        res.status(200).json({ message: "User account deleted successfully" });
    } catch (error) {
        console.error("Error deleting user account:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete("/admin/:adminId/delete", async (req, res) => {
    try {
        const adminId = req.params.adminId;
        if (!req.session.admin || req.session.admin.adminID.toString() !== adminId) {
            return res.status(401).json({ message: "Unauthorized: Admin not logged in or unauthorized to perform this action" });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        await Admin.findByIdAndDelete(adminId);
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
            }
        });
        res.status(200).json({ message: "Admin account deleted successfully" });
    } catch (error) {
        console.error("Error deleting admin account:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});





export default router;