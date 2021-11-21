import expressJwt from "express-jwt";

export const requiresAuth = expressJwt({
    secret: process.env.JWT_KEY,
    algorithms: ["HS256"],
});

export const requiresArtist = (req, res, next) => {
    if (req.user.userType !== "artist") {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
};
