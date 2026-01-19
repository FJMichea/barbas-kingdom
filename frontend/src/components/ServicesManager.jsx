import { useState, useEffect } from 'react';

const ServicesManager = () => {
    // ESTADOS
    const [services, setServices] = useState([]);
    const [form, setForm] = useState({ 
        nombre: '', 
        precio: '', 
        duracion: '', 
        descripcion: '', 
        categoria: 'Cabello', 
        imagenURL: '' 
    });

    // CARGAR SERVICIOS AL INICIO
    useEffect(() => {
        obtenerServicios();
    }, []);

    const obtenerServicios = async () => {
        try {
            const respuesta = await fetch('http://localhost:4000/api/services');
            const data = await respuesta.json();
            setServices(data);
        } catch (error) {
            console.error("Error cargando servicios:", error);
        }
    };

    const guardarServicio = async (e) => {
        e.preventDefault();
        
        // Si el usuario no pone foto, usamos una genérica de barbería
        const dataToSend = {
            ...form,
            imagenURL: form.imagenURL || 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500'
        };

        try {
            const respuesta = await fetch('http://localhost:4000/api/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });
            
            if (respuesta.ok) {
                obtenerServicios(); // Recargar lista
                // Limpiar formulario
                setForm({ nombre: '', precio: '', duracion: '', descripcion: '', categoria: 'Cabello', imagenURL: '' });
            }
        } catch (error) {
            console.error("Error guardando:", error);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div>
            {/* --- FORMULARIO DE ADMINISTRACIÓN --- */}
            <div className="card shadow mb-5 border-0">
                <div className="card-header bg-dark text-white fw-bold">
                    🛠 Panel de Dueño: Crear Nuevo Servicio
                </div>
                <div className="card-body bg-light">
                    <form onSubmit={guardarServicio} className="row g-3">
                        {/* Nombre */}
                        <div className="col-md-6">
                            <label className="form-label small text-muted">Nombre del Servicio</label>
                            <input type="text" name="nombre" className="form-control" 
                                placeholder="Ej: Corte Degradado" 
                                value={form.nombre} onChange={handleChange} required />
                        </div>

                        {/* Precio (SELECTOR, NO INPUT MANUAL) */}
                        <div className="col-md-3">
                            <label className="form-label small text-muted">Precio</label>
                            <select name="precio" className="form-select" value={form.precio} onChange={handleChange} required>
                                <option value="">Seleccionar...</option>
                                <option value="5000">$5.000</option>
                                <option value="8000">$8.000</option>
                                <option value="10000">$10.000</option>
                                <option value="12000">$12.000</option>
                                <option value="15000">$15.000</option>
                                <option value="18000">$18.000</option>
                                <option value="20000">$20.000</option>
                                <option value="25000">$25.000</option>
                            </select>
                        </div>

                        {/* Duración */}
                        <div className="col-md-3">
                            <label className="form-label small text-muted">Duración (min)</label>
                            <select name="duracion" className="form-select" value={form.duracion} onChange={handleChange} required>
                                <option value="">Tiempo...</option>
                                <option value="15">15 min</option>
                                <option value="30">30 min</option>
                                <option value="45">45 min</option>
                                <option value="60">60 min</option>
                            </select>
                        </div>

                        {/* Categoría */}
                        <div className="col-md-4">
                            <label className="form-label small text-muted">Categoría</label>
                            <select name="categoria" className="form-select" value={form.categoria} onChange={handleChange}>
                                <option value="Cabello">Cabello</option>
                                <option value="Barba">Barba</option>
                                <option value="Facial">Cuidado Facial</option>
                                <option value="Pack">Pack Completo</option>
                            </select>
                        </div>

                        {/* Imagen URL */}
                        <div className="col-md-8">
                            <label className="form-label small text-muted">URL de la Foto (Opcional)</label>
                            <input type="text" name="imagenURL" className="form-control" 
                                placeholder="https://..." 
                                value={form.imagenURL} onChange={handleChange} />
                        </div>

                        {/* Descripción */}
                        <div className="col-12">
                            <input type="text" name="descripcion" className="form-control" 
                                placeholder="Descripción corta (Ej: Incluye lavado y perfilado con navaja)" 
                                value={form.descripcion} onChange={handleChange} />
                        </div>

                        <div className="col-12">
                            <button type="submit" className="btn btn-dark w-100 fw-bold">
                                + AGREGAR SERVICIO AL CATÁLOGO
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* --- LISTA VISUAL DE SERVICIOS (TARJETAS) --- */}
            <h4 className="mb-4 text-secondary border-bottom pb-2">Vista Previa del Catálogo</h4>
            
            {services.length === 0 ? (
                <div className="alert alert-info text-center">No hay servicios creados. ¡Agrega el primero arriba!</div>
            ) : (
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {services.map((servicio) => (
                        <div key={servicio._id} className="col">
                            <div className="card h-100 shadow-sm border-0">
                                <div style={{height: '200px', overflow: 'hidden'}}>
                                    <img src={servicio.imagenURL} className="card-img-top" alt={servicio.nombre} 
                                        style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                </div>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h5 className="card-title fw-bold mb-0">{servicio.nombre}</h5>
                                        <span className="badge bg-success">${servicio.precio}</span>
                                    </div>
                                    <span className="badge bg-light text-dark border mb-2">{servicio.categoria}</span>
                                    <p className="card-text text-muted small">{servicio.descripcion}</p>
                                    <small className="text-secondary">⏱ {servicio.duracion} minutos</small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ServicesManager;