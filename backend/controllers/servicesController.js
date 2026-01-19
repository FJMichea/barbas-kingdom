// backend/controllers/servicesController.js
import Services from '../models/Services.js';

// Función para crear un servicio
const createService = async (req, res) => {
    // req.body contiene los datos que envía el usuario (nombre, precio, etc)
    const servicio = new Services(req.body);

    try {
        const servicioGuardado = await servicio.save();
        res.json(servicioGuardado);
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error al guardar el servicio');
    }
};

// Función para obtener todos los servicios
const getServices = async (req, res) => {
    try {
        const servicios = await Services.find();
        res.json(servicios);
    } catch (error) {
        console.log(error);
    }
};

export {
    createService,
    getServices
};