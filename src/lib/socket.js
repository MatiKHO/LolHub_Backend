import { Server } from "socket.io";
import { Message } from "../models/message.model.js";


export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "https://lolhubofficial.netlify.app",
      credentials: true,
    },
  });

  const userSockets = new Map(); // { userId: socketId }
  const userActivities = new Map(); // { userId: activity }

  // User - Socket connection
  io.on("connection", (socket) => {
    socket.on("user_connected", (userId) => {
      userSockets.set(userId, socket.id);
      userActivities.set(userId, "Idle");

      // broadcast to all connected sockets that this user just logged in
      io.emit("user_connected", userId);

      // send the list of all connected users to this user
      socket.emit("users_online", Array.from(userSockets.keys()));

      // send the list of all user activities to this user
      io.emit("activities", Array.from(userActivities.entries()));
    });

    // socket.on("update_activity", (userId, activity) => {
    //   console.log("activity updated", userId, activity);
    //   userActivities.set(userId, activity);
    //   io.emit("activity_updated", { userId, activity });
    // });


    socket.on("update_activity", (userId, activity) => {
      console.log("🔵 Received activity update:", { userId, activity });
    
      if (!userId || typeof userId !== "string" || !activity) {
        console.error("🔴 Invalid activity data received:", { userId, activity });
        return;
      }
    
      userActivities.set(userId, activity);
    
      console.log("🟢 Broadcasting activity update:", { userId, activity });
      io.emit("activity_updated", { userId, activity });
    });
    

    socket.on("send_message", async (data) => {
      try {
        const { senderId, receiverId, content } = data;

        const message = await Message.create({
          senderId,
          receiverId,
          content,
        });

        // send to receiver in realtime, if they are online
        const receiverSocketId = userSockets.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", message);
        }

        socket.emit("message_sent", message);
      } catch (error) {
        console.error("Message error:", error);
        socket.emit("message_error", error.message);
      }
    });

    socket.on("disconnect", () => {
      let disconnectedUserId;
      for (const [userId, socketId] of userSockets.entries()) {
        // find disconnected user
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          userSockets.delete(userId);
          userActivities.delete(userId);
          break;
        }
      }
      if (disconnectedUserId) {
        io.emit("user_disconnected", disconnectedUserId);
      }
    });
  });
};
