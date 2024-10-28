import User from "../models/user.models.js"
import { generateTokenAndSetCookeie } from "../lib/utils/generateToken.js"
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
    try {
        const { fullname, username, email, password } = req.body

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Email inválido" })
        }
        const existingUser = await User.findOne({ username })
        if (existingUser) {
            return res.status(400).json({ error: "O nome do usuário já existe. Escolha outro nome." })
        }
        const existingEmail = await User.findOne({ email })
        if (existingEmail) {
            return res.status(400).json({ error: "O email já existe. Escolha outro email." })
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "A senha deve ter pelo menos 6 caracteres" })
        }
        //hash password 
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new User({
            fullname,
            username,
            email,
            password: hashedPassword,
        })

        if (newUser) {
            generateTokenAndSetCookeie(newUser._id, res)
            await newUser.save()
            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.converImg,
            })
        }
        else {
            return res.status(400).json({ error: "Erro ao criar o novo usuário" })
        }

    } catch (error) {
        console.log("Signup error: ", error)
        res.status(500).json({ error: "Erro do servidor" })

    }
}

export const login = async (req, res) => {
    try {
        const {username, password} =req.body
        const user = await User.findOne({username})
        const ispassWordCorrect = await bcrypt.compare(password, user?.password || "")

        if(!user || !ispassWordCorrect){
            return res.status(400).json({error: "Usuário ou senha incorretos"})
        }

        generateTokenAndSetCookeie(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.converImg,
        })

    } catch (error) {
        console.log("Signup error: ", error)
        res.status(500).json({ error: "Erro do servidor" })

    }
}

export const logout = async (req, res) => {
    try{
        res.cookie("jwt","" , {maxAge: 0})
        res.status(200).json({message: "Deslogado com sucesso"})
    }catch(error){
        console.log("Logout error: ", error)
        res.status(500).json({ error: "Erro do servidor" })

    }
}

export const getMe = async (req, res) => {
    try{ 
        const user = await User.findById(req.user._id).select("-password")
        res.status(200).json(user)

    }catch(error){
        console.log({"Error in the get me route: ": error.message})
        res.status(500).json({error: "Erro do servidor"})

    }
}