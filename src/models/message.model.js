import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    }, // Clerk user Id
    receiverId: {
        type: String,
        required: true
    }, // Clerk user Id
    content: {
        type: String,
        required: true
    },
}, { timestamps: true }); // createdAt, updatedAt


export const Message = mongoose.model('Message', messageSchema);