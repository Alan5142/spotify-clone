import { Router } from "express";
import { requiresArtist, requiresAuth } from "../utils/auth";
import { body, validationResult, params } from 'express-validator';
import { multer } from "multer";
import { createAlbum } from "../controllers/artists-controller";

const router = Router();

const upload = multer({ dest: 'uploads/' });

router.post('/', 
    requiresAuth, 
    requiresArtist,
    body('name').isEmpty(),
    body('releaseDate').isDate(),
    body('tracks').custom(value => {
        return Array.isArray(value)
    }),
    params('id').isEmpty(),
    body('genres').custom(value => {
        return Array.isArray(value)
    }), 
    body('image').isEmpty(),
    upload.single('image'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        try {
            const album = await createAlbum(
                req.body.id, 
                req.body.name,
                req.body.releaseDate,
                req.body.tracks,
                req.file,
                req.body.description,
                req.body.genres
            );
            res.status(201).json(album);
        } catch(e){
            res.status(400).json({ errors: e.message });
        }
});

router.get('/:id');

export default router;