import { Router } from "express";
import userRouter from './users.js';
import artistRouter from './artists.js';

const router = Router();

router.use('/user', userRouter);
router.use('/artist', artistRouter);


export default router;