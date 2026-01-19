// backend/routes/servicesRoutes.js
import express from 'express';
import { createService, getServices } from '../controllers/servicesController.js';

const router = express.Router();

// Definimos las rutas
// Cuando alguien haga POST a /, ejecutamos createService
// Cuando alguien haga GET a /, ejecutamos getServices
router.route('/')
    .post(createService)
    .get(getServices);

export default router;