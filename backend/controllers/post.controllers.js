//packeges
import { v2 as cloudinary } from "cloudinary"

import Post from "../models/post.models.js"
import User from "../models/user.models.js"
import Notification from "../models/notifications.models.js"



export const createPost = async (req, res) => {
    try {
        const { text } = req.body
        let { img } = req.body
        const userId = req.user._id.toString()

        const user = await User.findById(userId)

        if (!user) return res.status(404).json({ error: "Usuário não encontrado" })
        if (!text && !img) return res.status(400).json({ error: "Por favor, adicione um texto ou imagem" })
        if (img) {
            const uploadResponse = await cloudinary.uploader.upload(img)
        }

        const newPost = new Post({
            user: userId,
            text,
            img
        })

        await newPost.save()
        res.status(201).json(newPost)

    } catch (error) {
        console.log("Error in createPost: ", error.message)
        res.status(500).json({ error: "Erro do servidor" })
    }
}

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id)
        if (!post) return res.status(404).json({ error: "Post não encontrado" })

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Não autorizado" })
        }

        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(imgId)
        }

        await Post.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Post deletado com sucesso" })

    } catch (error) {
        console.log("Error in deletePost: ", error.message)
        res.status(500).json({ error: "Erro do servidor" })

    }

}

export const likeAndUnlikePost = async (req, res) => {
    try {
        const userId = req.user._id
        const { id: postId } = req.params

        const post = await Post.findById(postId)

        if (!post) {
            return res.status(404).json({ error: "Postagem não encontrada" })
        }

        const userLikedPost = post.like.includes(userId)

        if (userLikedPost) {
            //unlike post
            await Post.updateOne({ _id: postId }, { $pull: { like: userId } })
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } })
            res.status(200).json({ message: "Postagem descurtida" })
        } else {
            //like post
            post.like.push(userId)
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } })
            await post.save()

            const newNotification = new Notification({
                from: userId,
                to: post.user,
                type: "like"
            })

            await newNotification.save()
            res.status(200).json({ message: "Postagem curtida" })

        }

    } catch (error) {
        console.log("Error in likeAndUnlikePost: ", error.message)
        res.status(500).json({ error: "Erro do servidor" })

    }

}

export const commentPost = async (req, res) => {
    try {
        const { text } = req.body
        const postId = req.params.id
        const userId = req.user._id

        if (!text) {
            return res.status(400).json({ error: "Por favor, adicione um texto" })
        }
        const post = await Post.findById(postId)

        if (!post) {
            return res.status(404).json({ error: "Postagem não encontrada" })
        }

        const newComment = { user: userId, text }

        post.comment.push(newComment)
        await post.save()

        res.status(200).json(post)

    } catch (error) {
        console.log("Error commenting post", error.message)
        res.status(500).json({ error: "Erro do servidor" })
    }

}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({ path: "user", select: "-password" }).populate({ path: "comment.user", select: "-password" })

        if (posts.length === 0) return res.status(200).json({ error: "Nenhum post encontrado" })

        res.status(200).json(posts)

    } catch (error) {
        console.log("Error in getAllPosts: ", error.message)
        res.status(500).json({ error: "Erro do servidor" })

    }
}

export const getAllLikes = async (req, res) => {
    const userId = req.params.id
    try {
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ error: "Usuário não encontrado" })

        const likedPost = await Post.find({ _id: { $in: user.likedPost } }).populate({ path: "user", select: "-password" }).populate({ path: "comment.user", select: "-password" })

        res.status(200).json(likedPost)



    } catch (error) {
        console.log("Error in getAllLikes: ", error.message)
        res.status(500).json({ error: "Erro do servidor" })
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)

        if (!user) return res.status(404).json({ error: "Usuário não encontrado" })

        const following = user.following

        const feedPosts = await Post.find({ user: { $in: following } })
            .sort({ createdAt: -1 }).populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comment.user",
                select: "-password"
            })

        res.status(200).json(feedPosts)


    } catch (error) {
        console.log("Error in getFollowingPosts", error)
        res.status(500).json({ error: "Erro no servidor" })

    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params

        const user = await User.findOne({ username })
        if (!user) return res.status(404).json({ error: "Usuário não encontrado" })

        const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comment.user",
            select: "-password",
        })

        res.status(200).json(posts)

    } catch (error) {
        console.log("Error in getUserPosts", error)
        res.status(500).json({ error: "Erro do servidor" })
    }
}