//packages
import { v2 as cloudinary } from "cloudinary"
import bcrypt from "bcryptjs"
//models
import User from "../models/user.models.js"
import Notification from "../models/notifications.models.js"



export const getUserProfile = async (req, res) => {
    const { username } = req.params


    try {
        const user = await User.findOne({ username }).select("-password")
        console.log("user: ", user)

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" })
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: "Erro do servidor" })
        console.log("Get user profile error: ", error.message)
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id

        const userFollowedByMe = await User.findById(userId).select("following")

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId }
                }
            },
            {
                $sample: { size: 10 }
            }
        ])

        const filteredUsers = users.filter(user => !userFollowedByMe.following.includes(user._id))
        const suggestedUsers = filteredUsers.slice(0, 4)

        suggestedUsers.forEach(user => { user.password = null })

        res.status(200).json(suggestedUsers)



    } catch (error) {
        console.log("Error in getSuggestedUsers: ", error.message)
        res.status(500).json({ error: "Erro do servidor" })

    }

}

export const getFollowersorUnfollow = async (req, res) => {
    try {
        const { id } = req.params
        const userModify = await User.findById(id)
        const correntUser = await User.findById(req.user._id)


        if (id === req.user._id.toString()) {
            return res.status(401).json({ error: "Você não pode seguir/deixar de você mesmo" })
        }

        if (!userModify || !correntUser) {
            return res.status(404).json({ error: "Usuário não encontrado" })
        }

        const isFollowing = userModify.followers.includes(correntUser._id)
        if (isFollowing) {
            //unfollow user
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } })
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } })

            res.status(200).json({ message: "Deixou de seguir" })


        } else {
            //follow user 
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } })
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } })

            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: userModify._id
            })

            await newNotification.save()

            //TODO return the id of the user as response
            res.status(200).json({ message: "Seguindo" })
        }




    } catch (error) {
        console.log("Get followers or unfollow error: ", error.message)
        res.status(500).json({ error: "Erro do servidor" })
    }

}

export const updateUserProfile = async (req, res) => {
    const { fullname, email, username, currentPassword, newPassword, bio, link } = req.body
    let { profileImg, converImg } = req.body

    const userId = req.user._id
    try {
        let user = await User.findById(userId)
        if (!user) return res.status(404).json({ error: "Usuário não encontrado" })

        if ((!newPassword && currentPassword) || (newPassword && !currentPassword)) {
            return res.status(400).json({ error: "Você precisa informar a senha antiga e a nova senha" })
        }

        if (newPassword && currentPassword) {
            const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password)

            if (!isPasswordCorrect) {
                return res.status(400).json({ error: "Senha incorreta" })
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ error: "A senha deve ter pelo menos 6 caracteres" })
            }

            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(newPassword, salt)
        }

        if (profileImg) {
            if (user.profileImg) {
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
            }
            const uploadResponse = await cloudinary.uploader.upload(profileImg)
            profileImg = uploadResponse.secure_url
        }

        if (converImg) {
            if (user.converImg) {
                await cloudinary.uploader.destroy(user.converImg.split("/").pop)
            }
            const uploadResponse = await cloudinary.uploader.upload(converImg)
            converImg = uploadResponse.secure_url
        }

        user.fullname = fullname || user.fullname
        user.email = email || user.email
        user.username = username || user.username
        user.bio = bio || user.bio
        user.link = link || user.link
        user.profileImg = profileImg || user.profileImg
        user.converImg = converImg || user.converImg

        user = await user.save()
        user.password = null
        return res.status(200).json({ message: "Usuário atualizado com sucesso" })


    } catch (error) {
        console.log("Update user profile error: ", error.message)
        res.status(500).json({ error: "Erro do servidor" })

    }

}