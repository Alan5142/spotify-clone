import { Router } from "express";
import { createArtist, getArtistById, modifyArtist, updateProfilePicture, updateCoverPicture } from "../controllers/artists-controller.js";
import { requiresAuth, requiresArtist } from "../utils/auth.js";
import albumRoutes from "./artist-album.js";
import expressValidator from 'express-validator';
import multer from "multer";
import { uploadCover } from "../data/files.js";


const { body, validationResult, param, oneOf } = expressValidator;

const router = Router();

router.post("/",
    body('name').notEmpty(),
    body('email', 'Email not Valid').normalizeEmail().isEmail(),
    body('password', 'Password of minimum 6 characters long').isLength({ min: 6 }),
    body('typeOf').notEmpty().isIn(['band', 'soloist']),
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
    param('id').notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const artist = await getArtistById(req.params.id);
            if (!artist) {
                res.status(404).send({ error: `Artist not found: ${req.params.id}` });
            }
            res.status(200).json(artist);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    });

//Modify artist info
router.put('/',
    requiresAuth,
    requiresArtist,
    oneOf([body('name').isEmpty(), body('name').notEmpty()]),
    oneOf([body('description').isEmpty(), body('description').notEmpty()]),
    oneOf([body('password').isEmpty(), body('password').isLength({ min: 6 })]),
    oneOf([body('artistType').isEmpty(), body('artistType').notEmpty().isIn(['band', 'soloist'])]),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const artist = await modifyArtist(
                req.user.id,
                req.body.name,
                req.body.password,
                req.body.description,
                req.body.artistType
            );
            res.status(200).json(artist);
        } catch (e) {
            res.status(400).json({ errors: [{ msg: e.message }] });
        }
    });

const upload = multer({ storage: multer.memoryStorage() });
router.post('/profile',
    requiresAuth,
    requiresArtist,
    upload.single('profile'),
    async (req, res) => {
        try {
            const artist = await updateProfilePicture(req.user.id, req.file);
            res.status(200).json(artist);
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: e.message });
        }
    }
);

router.post('/cover',
    requiresAuth,
    requiresArtist,
    upload.single('cover'),
    async (req, res) => {
        try {
            const artist = await updateCoverPicture(req.user.id, req.file);
            res.status(200).json(artist);
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: e.message });
        }
    }
);


router.use('/:id/album', albumRoutes);

export default router;