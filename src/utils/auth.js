import expressJwt from "express-jwt";

const requiresAuth = expressJwt({
    secret: process.env.JWT_KEY,
    algorithms: ["HS256"],
});

export default requiresAuth;