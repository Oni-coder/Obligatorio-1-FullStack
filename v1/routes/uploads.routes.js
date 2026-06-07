import express from 'express';
import { subirImagen } from '../controllers/uploads.controllers.js';
import { authenticateMiddleware } from '../middlewares/authenticate.middleware.js';

const router = express.Router({ mergeParams: true });

router.post("/", authenticateMiddleware, subirImagen);

export default router;