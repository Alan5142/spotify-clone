import { Router } from "express";
import { createArtist, getArtistById } from "../controllers/artists-controller.js";
import { requiresAuth, requiresArtist } from "../utils/auth.js";
import albumRoutes from "./artist-album.js";
import expressValidator from 'express-validator';

const { body, validationResult, param } = expressValidator;

const router = Router();

router.post("/", 
    body('name').notEmpty(),
    body('email', 'Email not Valid').normalizeEmail().isEmail(),
    body('password', 'Password of minimum 6 characters long').isLength({ min: 6 }),
    body('typeOf').notEmpty().isIn(['Band', 'Soloist']),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        try {
            const artist = await createArtist(req.body.name,
                req.body.email,
                req.body.password,
                req.body.description,
                req.body.typeOf
            );
            res.status(201).json(artist);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
});

// get current artist info from jwt
router.get("/", 
    requiresAuth, 
    requiresArtist,
    async (req, res) => {
    try {
        const artist = await getArtistById(req.user.id);
        res.status(200).json(artist);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

// Get artist info by id
router.get("/:id", 
    requiresAuth,
    param('id').isEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        try {
            const artist = await getArtistById(req.params.id);
            res.status(200).json(artist);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
});

router.use('/:id/album', albumRoutes);

export default router;