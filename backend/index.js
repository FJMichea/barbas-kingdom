// backend/index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import conectarDB from './config/db.js';
import servicesRoutes from './routes/servicesRoutes.js'; 
import barberRoutes from './routes/barberRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';

const app = express();

dotenv.config();

conectarDB();

app.use(cors());
app.use(express.json());

app.use('/api/services', servicesRoutes); 
app.use('/api/barbers', barberRoutes);
app.use('/api/reservations', reservationRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});