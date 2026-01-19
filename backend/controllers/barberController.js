import Barber from '../models/Barber.js';

const getBarbers = async (req, res) => {
    try {
        const barbers = await Barber.find();
        res.json(barbers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getBarbers };