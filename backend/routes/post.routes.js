import express from "express"
import { createPost, deletePost, likeAndUnlikePost, commentPost, getAllPosts, getAllLikes, getFollowingPosts, getUserPosts  } from "../controllers/post.controllers.js"
import { protectRoute } from "../middleware/protectRoute.js"

const router = express.Router()


router.get("/all", protectRoute, getAllPosts)
router.get("/all/likes/:id", protectRoute, getAllLikes)
router.post("/create", protectRoute, createPost)
router.delete("/delete/:id", protectRoute, deletePost)
router.post("/like/:id", protectRoute, likeAndUnlikePost)
router.post("/comment/:id", protectRoute, commentPost)
router.get("/following", protectRoute, getFollowingPosts)
router.get("/user/:username", protectRoute, getUserPosts)

export default router