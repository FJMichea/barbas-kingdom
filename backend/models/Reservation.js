import mongoose from 'mongoose';

const reservationSchema = mongoose.Schema({
    clienteNombre: { type: String, required: true },
    clienteEmail: { type: String, required: true },
    clienteTelefono: { type: String, required: true }, // Para WSP
    servicio: { type: String, required: true },
    precio: { type: Number, required: true },
    barbero: { type: String, required: true },
    fecha: { type: String, required: true }, // Ej: "2024-01-20"
    hora: { type: String, required: true }     // Ej: "15:30"
}, { timestamps: true });

const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;