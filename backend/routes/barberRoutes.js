import express from 'express';
import { getBarbers } from '../controllers/barberController.js';
const router = express.Router();

router.get('/', getBarbers);

export default router;