import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { hash, compare } from "bcrypt";
import mongoose from "mongoose";
import Admin, { IAdmin } from "../models/adminModel";
import User, { IUser } from "../models/userModel";
import Post from "../models/postModel";
import { Comment, CommentLike, CommentDislike } from "../models/commentModel";
import Like from "../models/likeModel";
import Dislike from "../models/dislikeModel";
import Tag from "../models/tagModel";




const router = express.Router();


require("dotenv").config();

interface UserSession {
    userID: mongoose.Types.ObjectId; 
    username: string;
    email: string;
    phone: string;
    bio: string;
    role: 'mentee' | 'mentor';
    img: string;
}

interface AdminSession {
    adminID: mongoose.Types.ObjectId; 
    fname: string;
    lname: string;
    email: string;
    phone: string;
}
  

declare module "express-session" {
    interface SessionData {
        user?: UserSession; 
        admin?: AdminSession; 
    }
}

// Middleware to verify user authentication
const authenticateUser = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: "User authentication required" });
    }
    next();
};

// Middleware to check if the user has already liked or disliked the post/comment
const checkAlreadyLikedOrDisliked = async (req, res, next) => {
    const { userID } = req.session.user;
    const { postID, commentID } = req.body;
    
    if (postID) {
        const existingLike = await Like.findOne({ postID, userID });
        const existingDislike = await Dislike.findOne({ postID, userID });
        if (existingLike || existingDislike) {
            return res.status(400).json({ message: "You have already liked or disliked this post" });
        }
    } else if (commentID) {
        const existingLike = await CommentLike.findOne({ commentID, userID });
        const existingDislike = await CommentDislike.findOne({ commentID, userID });
        if (existingLike || existingDislike) {
            return res.status(400).json({ message: "You have already liked or disliked this comment" });
        }
    }
    
    next();
};


router.post("/register", async (req: Request, res: Response) => {
    try {
        const { username, email, phone, password, cpwd, bio, role, img } = req.body;
        if (![username, email, phone, password, cpwd, bio, role, img].every(field => field)) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== cpwd) {
            return res.status(400).json({ message: "Both passwords must match" });
        }

        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).json({ message: "Username not available" });
        }

        const hashedPassword = await hash(password, 10);

        const newUser: IUser = new User({ username, email, phone, password: hashedPassword, bio, role, img });

        await newUser.save();

        const token = jwt.sign(
            {
                userID: newUser._id,
                email: newUser.email,
                username: newUser.username
            },
            process.env.JWT_SECRET!
        );

        const userSession: UserSession = {
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
    } catch (error) {
        console.error("Error during user registration:", error);
        return res.status(500).json({ message: "Error registering user" });
    }
});


   
router.post("/login", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        if ((!email && !username) || !password) {
            return res.status(400).json({ message: "Email/Username and password are required" });
        }

        let user: IUser | null = null;
        if (email) {
            user = await User.findOne({ email });
        }

        if (!user && username) {
            user = await User.findOne({ username });
        }

        if (!user) {
            return res.status(401).json({ message: "Invalid email/username or password" });
        }

        const isPasswordMatch = await compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid email/username or password" });
        }

        const token = jwt.sign(
            {
                userID: user._id,
                email: user.email
            },
            process.env.JWT_SECRET || "default_secret",
        );

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
    } catch (error) {
        console.error("Error during user login:", error);
        return res.status(500).json({ message: "Error logging in user" });
    }
});


router.post("/admin/register", async (req: Request, res: Response) => {
    try {
        const { fname, lname, email, phone, password, cpwd } = req.body;
        if (![fname, lname, email, phone, password, cpwd].every((field) => field)) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== cpwd) {
            return res.status(400).json({ message: "Both passwords must match!" });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await hash(password, 10);
        const newAdmin: IAdmin = new Admin({ fname, lname, email, phone, password: hashedPassword }) as IAdmin;
        await newAdmin.save();

        // Access token
        const token = jwt.sign(
            {
                adminID: newAdmin._id, 
                email: newAdmin.email
            },
            process.env.JWT_SECRET!,
        );

        const adminSession: AdminSession = {
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
    } catch (error) {
        console.error("Error during admin registration:", error);
        return res.status(500).json({ message: "Error registering admin" });
    }
});


   
router.post("/admin/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        try {
            const admin: IAdmin | null = await Admin.findOne({ email });
            if (!admin) {
                return res.status(401).json({ message: "Email not registered. Please register first." });
            }

            const isPasswordMatch = await compare(password, admin.password);

            if (!isPasswordMatch) {
                return res.status(401).json({ message: "Incorrect email or password" });
            }

            const token = jwt.sign(
                {
                    adminID: admin._id,
                    email: admin.email
                },
                process.env.JWT_SECRET || "default_secret",
            );

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
        } catch (error) {
            console.error("Error during admin login:", error);
            return res.status(500).json({ message: "Error logging in admin" });
        }
    } catch (error) {
        console.error("Error during admin login:", error);
        return res.status(500).json({ message: "Error logging in admin" });
    }
});


router.post("/post", async (req, res) => {
    try {
        const { title, content, author, tags } = req.body;
        if (![title, content, author, tags].every(field => field)) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newPost = new Post({ title, content, author, tags });
        await newPost.save();

        return res.status(201).json({ message: "Post created successfully" });
    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ message: "Error creating post" });
    }
});


router.post("/tag", async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name is required for the tag" });
        }

        const newTag = new Tag({ name });
        await newTag.save();

        return res.status(201).json({ message: "Tag created successfully" });
    } catch (error) {
        console.error("Error creating tag:", error);
        return res.status(500).json({ message: "Error creating tag" });
    }
});


router.post("/comment", async (req, res) => {
    try {
        const { content, author, postID } = req.body;
        if (![content, author, postID].every(field => field)) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newComment = new Comment({ content, author, postID });
        await newComment.save();

        return res.status(201).json({ message: "Comment created successfully" });
    } catch (error) {
        console.error("Error creating comment:", error);
        return res.status(500).json({ message: "Error creating comment" });
    }
});



router.post("/post/like", authenticateUser, checkAlreadyLikedOrDisliked, async (req, res) => {
    try {
        const { postID, userID } = req.body;
        if (!postID || !userID) {
            return res.status(400).json({ message: "Post ID and user ID are required" });
        }

        const existingLike = await Like.findOne({ postID, userID });
        if (existingLike) {
            await existingLike.remove();
            return res.status(200).json({ message: "Like removed successfully" });
        }

        const newLike = new Like({ postID, userID });
        await newLike.save();

        return res.status(201).json({ message: "Post liked successfully" });
    } catch (error) {
        console.error("Error handling post like:", error);
        return res.status(500).json({ message: "Error handling post like" });
    }
});


router.post("/post/dislike", authenticateUser, checkAlreadyLikedOrDisliked, async (req, res) => {
    try {
        const { postID, userID } = req.body;
        if (!postID || !userID) {
            return res.status(400).json({ message: "Post ID and user ID are required" });
        }

        const existingDislike = await Dislike.findOne({ postID, userID });
        if (existingDislike) {
            await existingDislike.remove();
            return res.status(200).json({ message: "Dislike removed successfully" });
        }

        const newDislike = new Dislike({ postID, userID });
        await newDislike.save();

        return res.status(201).json({ message: "Post disliked successfully" });
    } catch (error) {
        console.error("Error handling post dislike:", error);
        return res.status(500).json({ message: "Error handling post dislike" });
    }
});


router.post("/comment/like", authenticateUser, checkAlreadyLikedOrDisliked, async (req, res) => {
    try {
        const { commentID, userID } = req.body;
        if (!commentID || !userID) {
            return res.status(400).json({ message: "Comment ID and user ID are required" });
        }

        const existingLike = await CommentLike.findOne({ commentID, userID });
        if (existingLike) {
            await existingLike.remove();
            return res.status(200).json({ message: "Comment like removed successfully" });
        }

        const newLike = new CommentLike({ commentID, userID });
        await newLike.save();

        return res.status(201).json({ message: "Comment liked successfully" });
    } catch (error) {
        console.error("Error handling comment like:", error);
        return res.status(500).json({ message: "Error handling comment like" });
    }
});


router.post("/comment/dislike", authenticateUser, checkAlreadyLikedOrDisliked, async (req, res) => {
    try {
        const { commentID, userID } = req.body;
        if (!commentID || !userID) {
            return res.status(400).json({ message: "Comment ID and user ID are required" });
        }

        const existingDislike = await CommentDislike.findOne({ commentID, userID });
        if (existingDislike) {
            await existingDislike.remove();
            return res.status(200).json({ message: "Comment dislike removed successfully" });
        }

        const newDislike = new CommentDislike({ commentID, userID });
        await newDislike.save();

        return res.status(201).json({ message: "Comment disliked successfully" });
    } catch (error) {
        console.error("Error handling comment dislike:", error);
        return res.status(500).json({ message: "Error handling comment dislike" });
    }
});



export default router;