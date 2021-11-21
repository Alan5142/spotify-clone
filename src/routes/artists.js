import { Router } from "express";
import { createArtist, getArtistById } from "../controllers/artists-controller.js";
import { requiresAuth, requiresArtist } from "../utils/auth.js";
import albumRoutes from "./artist-album.js";

const router = Router();

router.post("/", async (req, res) => {
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
router.get("/", requiresAuth, requiresArtist, async (req, res) => {
    try {
        const artist = await getArtistById(req.user.id);
        res.status(200).json(artist);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

// Get artist info by id
router.get("/:id", requiresAuth, requiresArtist, async (req, res) => {
    try {
        const artist = await getArtistById(req.params.id);
        res.status(200).json(artist);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.use('/:id/album', albumRoutes);

export default router;