import { Router } from 'express';
import User from '../models/user.js';
import Artist from '../models/artist.js';
import { comparePasswords } from '../utils/encrypt.js';
import { body, validationResult, params } from 'express-validator';

const router = Router();

// login with jwt
router.post('/user', 
    body('email', 'Not valid Email').normalizeEmail().isEmail(),
    body('password', 'Password cannot be empty').isEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }
            const isMatch = await comparePasswords(req.body.password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }
            const jwt = user.generateAuthToken();
            res.json({ token: jwt });
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
});

router.post('/artist', 
    body('email', 'Not valid Email').normalizeEmail().isEmail(),
    body('password', 'Password cannot be empty').isEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        try {
            const artist = await Artist.findOne({ name: req.body.name });
            if (!artist) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }
            const isMatch = await comparePasswords(req.body.password, artist.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }
            const jwt = artist.generateAuthToken();
            res.json({ token: jwt });
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
});

export default router;