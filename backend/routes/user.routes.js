import express from "express"
import { getUserProfile,getFollowersorUnfollow, getSuggestedUsers, updateUserProfile } from "../controllers/user.controllers.js"
import { protectRoute } from "../middleware/protectRoute.js"


const router = express.Router()

router.get("/profile/:username",protectRoute,getUserProfile)
router.get("/suggested", protectRoute,getSuggestedUsers)
router.get("/follow/:id", protectRoute,getFollowersorUnfollow)
router.get("/update", protectRoute,updateUserProfile)


export default router