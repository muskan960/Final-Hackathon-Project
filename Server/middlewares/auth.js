
import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {   // res, req ko swap na karo
    try {
        const { userId, has } = req.auth();  // agar req.auth() async hai, use await
        const hasPremiumPlan = await has({ plan: 'premium' });

        const user = await clerkClient.users.getUser(userId);

        if (!hasPremiumPlan && user.privateMetadata.free_usage) {
            req.free_usage = user.privateMetadata.free_usage;
        } else {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: 0 }
            });
            req.free_usage = 0;
        }
        req.plan = hasPremiumPlan ? 'premium' : 'free';
        req.userId = userId; // <-- set userId here
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
}
