import { Router } from "express";
import { requiresArtist, requiresAuth } from "../utils/auth";
import { body, validationResult, params } from 'express-validator';
import { multer } from "multer";
import { createAlbum, getAlbumById, modifyAlbum } from "../controllers/artists-controller";

const router = Router();

const upload = multer({ dest: 'uploads/' });

//Create album
router.post('/', 
    requiresAuth, 
    requiresArtist,
    body('name').notEmpty(),
    body('releaseDate').isDate(),
    body('tracks').custom(value => {
        return Array.isArray(value)
    }),
    params('id').notEmpty(),
    body('genres').custom(value => {
        return Array.isArray(value)
    }), 
    body('image').notEmpty(),
    upload.single('image'),
    (req, res) => {
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
        } catch(e){
            res.status(400).json({ errors: e.message });
        }
});

//Get album by id
router.get('/:id',
    requiresAuth,
    params('is').notEmpty(),
    (req, res) =>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        try {
            const album = await getAlbumById(req.params.id);
            if(!album){
                res.status(404).send({ error: `Album not found: ${req.params.id}`});
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
    params('id').notEmpty(),
    oneOf([body('name').isEmpty(), body('name').notEmpty()]),
    oneOf([body('releaseDate').isDate(), body('releaseDate').isEmpty()]),
    oneOf([body('tracks').custom(value => {
        return Array.isArray(value)
    }), body('tracks').isEmpty()]),
    body('genres').custom(value => {
        return Array.isArray(value)
    }),
    (req, res) => {
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
        } catch(e){
            res.status(400).json({ errors: e.message });
        }
});

export default router;