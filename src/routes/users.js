import { Router } from "express";
import { createUser, getUserById, modifyUser } from "../controllers/user-controller.js";
import { requiresAuth } from "../utils/auth.js";

const router = Router();

// Create user
router.post('/', async (req, res) => {
    try {
        await createUser(req.body.name, req.body.email, req.body.password);
        res.status(201).send();
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// get current authenticated user from database
router.get('/', requiresAuth, async (req, res) => {
    try {
        const user = await getUserById(req.user.id);
        res.json(user);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.put('/', requiresAuth, async (req, res) => {
    try {
        const user = await getUserById(req.user.id);
        await modifyUser(user, req.body.name, req.body.email, req.body.password);
        res.status(200).send();
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});


export default router;