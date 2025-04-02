import { User } from '../models/user.model.js';
import { Message } from '../models/message.model.js';



export const getAllUsers = async (req, res, next) => {
    try {
        const currentUserId = req.auth.userId; // search currentUserId 
        const users = await User.find({ clerkId: { $ne: currentUserId }}); // find all users except the current user
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const getMessages = async (req, res, next) => {
    try {
        const myId = req.auth.userId;
        const {userId} = req.params;

        const messages = await Message.find({
            $or: [
                {senderId:userId, receiverId:myId},
                {senderId:myId, receiverId:userId}
            ]
        }).sort({ createdAt: 1});
        res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
}