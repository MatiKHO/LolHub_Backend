import { User } from '../models/user.model.js';

export const getAllUsers = async (req, res, next) => {
    try {
        const currentUserId = req.auth.userId; // search currentUserId 
        const users = await User.find(); // find all users except the current user
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};