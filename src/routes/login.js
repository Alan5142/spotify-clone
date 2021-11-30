import { Router } from 'express';
import User from '../models/user.js';
import Artist from '../models/artist.js';
import { comparePasswords } from '../utils/encrypt.js';
import expressValidator from 'express-validator';

const { body, validationResult, params } = expressValidator;

const router = Router();

// login with jwt
router.post('/', 
    body('email', 'Not valid Email').normalizeEmail().notEmpty(),
    body('password', 'Password cannot be empty').notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                const artist = await Artist.findOne({ email: req.body.email });
                if (!artist) {
                    return res.status(400).json({ error: 'Invalid credentials' });
                }
                const isMatch = await comparePasswords(req.body.password, artist.password);
                if (!isMatch) {
                    return res.status(400).json({ error: 'Invalid credentials' });
                }
                const jwt = artist.generateAuthToken();
                res.json({ token: jwt });
                return;
            }
            const isMatch = await comparePasswords(req.body.password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }
            const jwt = user.generateAuthToken();
            res.json({ token: jwt });
        } catch (error) {
            res.status(500).json({error: error.message});
        }
});

export default router;