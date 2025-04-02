import { User } from '../models/user.model.js';



export const authCallback = async(req, res, next) => {
    try {
        const { id, firstName, lastName, imageUrl } = req.body;

        // check if id is present
        if (!id) {
            return res.status(400).json({ message: "Missing user ID" });
        }

        // check if user exists
        const user = await User.findOne({clerkId: id});

        if(!user) {
            // signup
            
            await User.create({
                clerkId: id,
                fullName: `${firstName || ""} ${lastName || ""} `.trim(),
                imageUrl,
            });
            console.log("User created:", user);
        } else {
            console.log("User exists:", user);
        }

        res.status(200).json({success: true});
    } catch (error) {
        console.log("Error in auth callback", error);
        next(error);
    }
};

