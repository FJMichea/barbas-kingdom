// backend/models/Barber.js
import mongoose from 'mongoose';

const barberSchema = mongoose.Schema({
    nombre: { type: String, required: true },
    especialidad: { type: String, default: 'Barbero General' }, // Ej: "Especialista en Navaja"
    experiencia: { type: String }, // Ej: "5 años"
    foto: { type: String }, // URL de la foto
    diasDisponibles: [String], // Ej: ["Lunes", "Martes", "Viernes"]
    horarioInicio: { type: String, default: "10:00" },
    horarioFin: { type: String, default: "20:00" }
});

const Barber = mongoose.model('Barber', barberSchema);
export default Barber;