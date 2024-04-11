import express, { Request, Response } from "express";
import Admin, { IAdmin } from "../models/adminModel";
import User, { IUser } from "../models/userModel";
import Post from "../models/postModel";
import { Comment, CommentLike, CommentDislike } from "../models/commentModel";
import Like from "../models/likeModel";
import Dislike from "../models/dislikeModel";
import Tag from "../models/tagModel";


const router = express.Router();



router.get("/", (req: Request, res: Response) => {
    res.json({ message: "Welcome to ProForum API" });
    });

router.get("/users", async (req: Request, res: Response) => {
    try {
        const users: IUser[] = await User.find();
        if (users.length === 0) {
            res.status(404).json({ Message: "Users not available" });
        } else {
            res.json({ data: users });
        }
        } catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});

    
router.get("/users/:userId", async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const user: IUser | null = await User.findById(userId);
    
        if (!user) {
        res.status(404).json({ Message: "User not found" });
        } else {
        res.json({ data: user });
        }
    } catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});


router.get("/admin", async (req: Request, res: Response) => {
    try {
        const admins: IAdmin[] = await Admin.find();
        if (admins.length === 0) {
            res.status(404).json({ Message: "Admins not available" });
        } else {
            res.json({ data: admins });
        }
        } catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});

    
router.get("/admin/:adminId", async (req: Request, res: Response) => {
    try {
        const adminId = req.params.adminId;
        const admin: IAdmin | null = await Admin.findById(adminId);
    
        if (!admin) {
        res.status(404).json({ Message: "Admin not found" });
        } else {
        res.json({ data: admin });
        }
    } catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});


router.get("/posts", async (req: Request, res: Response) => {
    try {
        const posts = await Post.find();
        return res.status(200).json(posts);
    } catch (error) {
        console.error("Error retrieving posts:", error);
        return res.status(500).json({ message: "Error retrieving posts" });
    }
});


router.get("/posts/:postId", async (req: Request, res: Response) => {
    try {
        const postId = req.params.courseId;
        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        
        return res.status(200).json(post);
    } catch (error) {
        console.error("Error retrieving post:", error);
        return res.status(500).json({ message: "Error retrieving post" });
    }
});


router.get("/tags", async (req: Request, res: Response) => {
    try {
        const tags = await Tag.find();
        return res.status(200).json(tags);
    } catch (error) {
        console.error("Error retrieving tags:", error);
        return res.status(500).json({ message: "Error retrieving tags" });
    }
});


router.get("/tags/:tagId", async (req: Request, res: Response) => {
    try {
        const tagId = req.params.tagId;
        const tag = await Tag.findById(tagId);
        
        if (!tag) {
            return res.status(404).json({ message: "Tag not found" });
        }
        
        return res.status(200).json(tag);
    } catch (error) {
        console.error("Error retrieving tag:", error);
        return res.status(500).json({ message: "Error retrieving tag" });
    }
});


router.get("/comments", async (req: Request, res: Response) => {
    try {
        const comments = await Comment.find();
        return res.status(200).json(comments);
    } catch (error) {
        console.error("Error retrieving comments:", error);
        return res.status(500).json({ message: "Error retrieving comments" });
    }
});


router.get("/comments/:commentId", async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const comment = await Comment.findById(commentId);
        
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        
        return res.status(200).json(comment);
    } catch (error) {
        console.error("Error retrieving comment:", error);
        return res.status(500).json({ message: "Error retrieving comment" });
    }
});

router.get("/posts/likes", async (req, res) => {
    try {
        const posts = await Post.find().populate('likes');
        return res.status(200).json(posts);
    } catch (error) {
        console.error("Error retrieving posts with likes:", error);
        return res.status(500).json({ message: "Error retrieving posts with likes" });
    }
});

router.get("/posts/dislikes", async (req, res) => {
    try {
        const posts = await Post.find().populate('dislikes');
        return res.status(200).json(posts);
    } catch (error) {
        console.error("Error retrieving posts with dislikes:", error);
        return res.status(500).json({ message: "Error retrieving posts with dislikes" });
    }
});


router.get("/posts/:postId/likes", async (req, res) => {
    try {
        const postId = req.params.postId;
        const likes = await Like.find({ postID: postId });
        
        return res.status(200).json(likes);
    } catch (error) {
        console.error("Error retrieving likes for post:", error);
        return res.status(500).json({ message: "Error retrieving likes for post" });
    }
});


router.get("/posts/:postId/dislikes", async (req, res) => {
    try {
        const postId = req.params.postId;
        const dislikes = await Dislike.find({ postID: postId });
        
        return res.status(200).json(dislikes);
    } catch (error) {
        console.error("Error retrieving dislikes for post:", error);
        return res.status(500).json({ message: "Error retrieving dislikes for post" });
    }
});


router.get("/comments/:commentId/likes", async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const likes = await CommentLike.find({ commentID: commentId });
        
        return res.status(200).json(likes);
    } catch (error) {
        console.error("Error retrieving likes for comment:", error);
        return res.status(500).json({ message: "Error retrieving likes for comment" });
    }
});


router.get("/comments/:commentId/dislikes", async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const dislikes = await CommentDislike.find({ commentID: commentId });
        
        return res.status(200).json(dislikes);
    } catch (error) {
        console.error("Error retrieving idslikes for comment:", error);
        return res.status(500).json({ message: "Error retrieving dislikes for comment" });
    }
});



export default router;