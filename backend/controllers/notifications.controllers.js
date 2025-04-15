import Notification from "../models/notifications.models.js"



export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id

        const notifications = await Notification.find({ to: userId }).populate({
            path: "from",
            select: "username profileImg"
        })

        await Notification.updateMany({ to: userId }, { read: true })

        res.status(200).json(notifications)

    } catch (error) {
        console.log("Error in getNotifications", error.message)
        res.status(500).json("Erro do servidor")
    }

}

export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id

        await Notification.deleteMany({ to: userId })

        res.status(200).json({ message: "Notificações deletadas com sucesso" })

    } catch (error) {
        console.log("Error in deleteNotifications", error.message)
        res.status(500).json("Erro do Servidor")
    }

}

export const deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params._id
        const userId = req.user_id

        const notification = await Notification.findById(notificationId)

        if (!notification) return res.status(404).json({ error: "Notificação não encontradada!" })
        if (notification.to.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Você não tem permissão para apagar a notificação" })
        }

        await Notification.findByIdAndDelete(notification)
        res.status(200).json({ message: "Notificação apagada com sucesso" })
    } catch (error) {
        console.log("Error in deleteNotification", error.message)
        res.status(500).json("Erro do Servidor")

    }
}