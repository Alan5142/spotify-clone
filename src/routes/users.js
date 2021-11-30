import { Router } from "express";
import { createUser, getUserById, modifyUser } from "../controllers/user-controller.js";
import { requiresAuth } from "../utils/auth.js";
import expressValidator from 'express-validator';

const router = Router();

const { body, validationResult, param, oneOf } = expressValidator;

// Create user
router.post('/', 
    body('name').notEmpty(),
    body('email', 'Email not Valid').normalizeEmail().isEmail(),
    body('password', 'Password of minimum 6 characters long').isLength({ min: 6 }),
    async (req, res) => {
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        try {
            await createUser(req.body.name, req.body.email, req.body.password);
            res.status(201).json({});
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

router.put('/', 
    requiresAuth, 
    body('name').notEmpty(),
    body('password', 'Password of minimum 6 characters long').isLength({ min: 6 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        try {
            const user = await getUserById(req.user.id);
            await modifyUser(user, req.body.name, req.body.password);
            res.status(200).send();
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
});


export default router;