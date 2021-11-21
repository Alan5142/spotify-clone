import { Router } from "express";
import userRouter from './users.js';
import artistRouter from './artists.js';
import loginRouter from './login.js';

const router = Router();

router.use('/user', userRouter);
router.use('/artist', artistRouter);
router.use('/login', loginRouter);


export default router;