import { Router } from "express";
import { requiresArtist, requiresAuth } from "../utils/auth.js";
import expressValidator from 'express-validator';
import multer from "multer";
import { createAlbum } from "../controllers/artists-controller.js";

const { body, validationResult, param } = expressValidator;

const router = Router({ mergeParams: true });

const upload = multer({ storage: multer.memoryStorage() });

router.post('/',
    upload.single('image'),
    requiresAuth,
    requiresArtist,
    body('name').notEmpty(),
    body('releaseDate').isDate(),
    body('tracks').custom(value => {
        return Array.isArray(value)
    }),
    param('id').notEmpty(),
    body('genres').custom(value => {
        return Array.isArray(value)
    }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const album = await createAlbum(
                req.params.id,
                req.body.name,
                req.body.releaseDate,
                req.body.tracks,
                req.file,
                req.body.description,
                req.body.genres
            );
            res.status(201).json(album);
        } catch (e) {
            res.status(400).json({ errors: e.message });
        }
    });

router.get('/:id');

export default router;