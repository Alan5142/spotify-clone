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
            const user = await createUser(req.body.name, req.body.email, req.body.password);
            if (user === null) {
                return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
            }
            return res.status(201).json({ user });
        } catch (error) {
            res.status(400).send({ errors: [{ msg: error.message }] });
        }
    });

// get current authenticated user from database
router.get('/', requiresAuth, async (req, res) => {
    try {
        const user = await getUserById(req.user.id);
        res.json(user);
    } catch (error) {
        res.status(500).send({ errorS: [{ msg: error.message }] });
    }
});

router.put('/',
    requiresAuth,
    body('name').notEmpty(),
    oneOf([
        body('password', 'Password of minimum 6 characters long').isLength({ min: 6 }),
        body('password', 'Password is not empty nor has at least 6 characters').isEmpty()
    ]),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        console.log(req.body);
        try {
            const user = await modifyUser(req.user.id, req.body.name, req.body.password);
            res.status(200).send({ user });
        } catch (error) {
            res.status(400).send({ errors: [{ msg: error.message }] });
        }
    });


export default router;