import { Router } from "express";
import userRouter from './users.js';
import artistRouter from './artists.js';
import loginRouter from './login.js';
import { search } from '../controllers/search-controller.js'
import expressValidator from 'express-validator';

const { query, validationResult  } = expressValidator;

const router = Router();

router.use('/user', userRouter);
router.use('/artist', artistRouter);
router.use('/login', loginRouter);
router.get('/search', 
    query('search').notEmpty(),
    async (req, res) => {
        try {
            const searchResult = await search(req.query.search);
            res.status(200).json({searchResult});
        } catch (error) {
            console.error(error);
            res.status(500).json({errors: [error.message]});
        }
    });


export default router;