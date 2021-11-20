import { Router } from "express";
import { createUser } from "../controllers/user-controller.js";

const router = Router();

// Create user
router.post('/', async (req, res) => {
    try {
        await createUser(req.body.name, req.body.email, req.body.password);   
        res.status(201).send();
    } catch (error) {
        res.status(400).send(error);
    }
});

export default router;