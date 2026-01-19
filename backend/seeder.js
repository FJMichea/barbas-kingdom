import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Barber from './models/Barber.js';
import Services from './models/Services.js';
import conectarDB from './config/db.js';

dotenv.config();
conectarDB();

const barberos = [
    { 
        nombre: "Juan Pérez", especialidad: "Master Barber", 
        foto: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400", 
        diasDisponibles: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"], horarioInicio: "10:00", horarioFin: "20:00" 
    },
    { 
        nombre: "Diego Soto", especialidad: "Urban Style", 
        foto: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400", 
        diasDisponibles: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"], horarioInicio: "10:00", horarioFin: "20:00" 
    },
    // NUEVA IMAGEN CARLOS (Hombre con barba estilo serio)
    { 
        nombre: "Carlos Muñoz", especialidad: "Barbas", 
        foto: "https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=400", 
        diasDisponibles: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"], horarioInicio: "10:00", horarioFin: "20:00" 
    },
    // NUEVA IMAGEN MATÍAS (Estilo joven colorista)
    { 
        nombre: "Matías Torres", especialidad: "Colorista", 
        foto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400", 
        diasDisponibles: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"], horarioInicio: "10:00", horarioFin: "20:00" 
    },
    { 
        nombre: "Luis Vega", especialidad: "Clásico", 
        foto: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=400", 
        diasDisponibles: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"], horarioInicio: "10:00", horarioFin: "20:00" 
    }
];

const servicios = [
    { nombre: "Corte de Cabello", precio: 14000, duracion: 45, descripcion: "Corte clásico o degradado", categoria: "Cabello" },
    { nombre: "Perfilado de Barba", precio: 14000, duracion: 30, descripcion: "Con toalla caliente", categoria: "Barba" },
    { nombre: "Corte de Cabello y Lavado", precio: 16000, duracion: 45, descripcion: "Servicio completo de higiene", categoria: "Combo" },
    { nombre: "Corte y Perfilado Barba", precio: 24000, duracion: 60, descripcion: "Renovación total", categoria: "Combo" },
    { nombre: "Corte, Lavado y Barba", precio: 26000, duracion: 75, descripcion: "La experiencia completa", categoria: "Combo" }
];

const importarDatos = async () => {
    try {
        await Barber.deleteMany();
        await Services.deleteMany();
        await Barber.insertMany(barberos);
        await Services.insertMany(servicios);
        console.log('✅ Datos Actualizados (Fotos Nuevas)');
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

importarDatos();