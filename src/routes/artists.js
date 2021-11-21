import { Router } from "express";
import { createArtist } from "../controllers/artists-controller.js";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const artist = await createArtist(req.body.name, req.body.email, req.body.password);
        res.status(201).json(artist);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

// get current artist info from jwt
router.get("/", async (req, res) => {
    try {
        const artist = await Artist.findById(req.user.id);
        res.status(200).json(artist);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

export default router;