import express from 'express';
import Reservation from '../models/Reservation.js';
// import nodemailer ... (mantén tu configuración de correo si la tienes)

const router = express.Router();

// 1. CREAR RESERVA
router.post('/', async (req, res) => {
    try {
        const nuevaReserva = new Reservation(req.body);
        await nuevaReserva.save();
        // Aquí iría el código de nodemailer...
        res.status(201).json({ message: 'Reserva creada', reserva: nuevaReserva });
    } catch (error) {
        res.status(400).json({ message: 'Error al reservar', error });
    }
});

// 2. OBTENER RESERVAS POR EMAIL (NUEVO)
router.get('/', async (req, res) => {
    try {
        const { email } = req.query;
        let query = {};
        if (email) {
            query = { clienteEmail: email };
        }
        // Buscamos las reservas y las ordenamos por fecha (más nuevas primero)
        const reservas = await Reservation.find(query).sort({ createdAt: -1 });
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;