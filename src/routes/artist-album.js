import { Router } from "express";
import { requiresArtist, requiresAuth } from "../utils/auth.js";
import expressValidator from 'express-validator';
import multer from "multer";
import { createAlbum, getAlbumById } from "../controllers/artists-controller.js";

const { body, validationResult, param, oneOf } = expressValidator;

const router = Router({ mergeParams: true });

const upload = multer({ storage: multer.memoryStorage() });

router.post('/',
    upload.fields([
        { name: 'cover', maxCount: 1 },
        { name: 'trackFiles', maxCount: 500 }
    ]),
    requiresAuth,
    requiresArtist,
    body('name').notEmpty(),
    body('releaseDate').isDate(),
    body('tracks').notEmpty().custom(value => value && !Array.isArray(value)),
    body('tracks').customSanitizer(value => value.split(',').map(v => v.trim())),
    param('id').notEmpty(),
    body('genres').custom(value => {
        return Array.isArray(value)
    }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        if (req.files['trackFiles'].length != req.body.tracks.length) {
            return res.status(400).json({ msg: 'Invalid number of tracks' });
        }
        try {
            const album = await createAlbum({
                artistId: req.params.id,
                name: req.body.name,
                releaseDate: req.body.releaseDate,
                tracks: req.files['trackFiles'],
                image: req.files['cover'][0],
                description: req.body.description,
                genres: req.body.genres,
                trackNames: req.body.tracks,
            });
            res.status(201).json(album);
        } catch (e) {
            res.status(400).json({ errors: e.message });
        }
    });

//Get album by id
router.get('/:id',
    requiresAuth,
    param('id').notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const album = await getAlbumById(req.params.id);
            if (!album) {
                res.status(404).send({ error: `Album not found: ${req.params.id}` });
            }
            res.status(200).json(album);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    });

//Modify album info
router.put('/:id',
    requiresAuth,
    requiresArtist,
    param('id').notEmpty(),
    oneOf([body('name').isEmpty(), body('name').notEmpty()]),
    oneOf([body('releaseDate').isDate(), body('releaseDate').isEmpty()]),
    oneOf([body('tracks').custom(value => {
        return Array.isArray(value)
    }), body('tracks').isEmpty()]),
    oneOf([body('genres').custom(value => {
        return Array.isArray(value)
    }), body('genres').isEmpty()]),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const album = await modifyAlbum(
                req.params.id,
                req.body.name,
                req.body.releaseDate,
                req.body.tracks,
                req.body.description,
                req.body.genres
            );
            res.status(200).json(album);
        } catch (e) {
            res.status(400).json({ errors: e.message });
        }
    });

export default router;
