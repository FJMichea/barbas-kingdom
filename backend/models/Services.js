// backend/models/Services.js
import mongoose from 'mongoose';

const servicesSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    precio: {
        type: Number,
        required: true,
    },
    duracion: {
        type: Number, // Minutos
        required: true
    },
    descripcion: { // Ej: "Incluye toalla caliente"
        type: String,
        default: ''
    },
    categoria: { // Ej: "Cabello", "Barba", "Combo"
        type: String, 
        default: 'General'
    },
    imagenURL: { // Usaremos URLs de internet por ahora para no complicar con subida de archivos
        type: String, 
        default: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&auto=format&fit=crop&q=60'
    }
}, {
    timestamps: true
});

const Services = mongoose.model('Services', servicesSchema);
export default Services;