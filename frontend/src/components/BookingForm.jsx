import { useState } from 'react';
import Swal from 'sweetalert2';

const BookingForm = ({ barbers, services, externalProfileTrigger, onCloseExternalProfile }) => {
    
    // ESTADOS
    const [selectedBarberFilter, setSelectedBarberFilter] = useState(null);
    const [activeAccordion, setActiveAccordion] = useState(null); // Controla qué barbero está abierto
    const [showModal, setShowModal] = useState(false); // Modal de Reserva
    const [modalStep, setModalStep] = useState(1);

    // SELECCIONES
    const [selectedService, setSelectedService] = useState(null);
    const [selectedBarberForBooking, setSelectedBarberForBooking] = useState(null);
    
    // CALENDARIO
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);
    const [selectedTime, setSelectedTime] = useState(null);
    const [datesList, setDatesList] = useState([]);
    const [userData, setUserData] = useState({ nombre: '', email: '', telefono: '' });
    const [reservaFinal, setReservaFinal] = useState(null);

    // GENERAR FECHAS
    const generateNextDays = () => {
        const days = [];
        const today = new Date();
        const daysOfWeek = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            days.push({ dayName: daysOfWeek[date.getDay()], dayNumber: date.getDate(), fullDate: date.toLocaleDateString('es-CL') });
        }
        setDatesList(days);
    };

    const getGroupedSlots = () => {
        const slots = { morning: [], afternoon: [], evening: [] };
        for (let i = 10; i < 20; i++) {
            const time = `${i}:00`; const time30 = `${i}:30`;
            if (i < 12) { slots.morning.push(time); slots.morning.push(time30); }
            else if (i < 19) { slots.afternoon.push(time); slots.afternoon.push(time30); }
            else { slots.evening.push(time); slots.evening.push(time30); }
        }
        return slots;
    };

    // --- MANEJO DE APERTURA DE RESERVA ---
    const handleServiceClick = (service, barber) => {
        if (externalProfileTrigger) { onCloseExternalProfile(); }
        
        setSelectedService(service);
        setSelectedBarberForBooking(barber);
        generateNextDays();
        setModalStep(1);
        setShowModal(true);
    };

    // --- MANEJO DE CIERRE CON ALERTA (Z-INDEX CORREGIDO) ---
    const handleCloseModal = () => {
        Swal.fire({
            title: '¿Deseas descartar esta cita?',
            text: "Se perderán los datos seleccionados.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#198754',
            confirmButtonText: 'Descartar',
            cancelButtonText: 'Continuar agendando',
            reverseButtons: true,
            allowOutsideClick: false,
            // Esto asegura que la alerta tenga prioridad visual
            didOpen: () => {
                const swalContainer = document.querySelector('.swal2-container');
                if(swalContainer) swalContainer.style.zIndex = '999999';
            }
        }).then((result) => {
            if (result.isConfirmed) {
                setShowModal(false);
                setModalStep(1);
                setSelectedTime(null);
                setUserData({ nombre: '', email: '', telefono: '' });
            }
        });
    };

    const handleReserva = async (e) => {
        e.preventDefault();
        const nuevaReserva = {
            clienteNombre: userData.nombre,
            clienteEmail: userData.email,
            clienteTelefono: userData.telefono,
            servicio: selectedService.nombre,
            precio: selectedService.precio,
            barbero: selectedBarberForBooking.nombre,
            fecha: datesList[selectedDateIndex].fullDate,
            hora: selectedTime
        };

        try {
            const res = await fetch('http://localhost:4000/api/reservations', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(nuevaReserva)
            });
            if (res.ok) {
                const data = await res.json();
                setReservaFinal(data.reserva);
                setModalStep(3);
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo conectar con el servidor", "error");
        }
    };

    const displayedBarbers = selectedBarberFilter 
        ? barbers.filter(b => b._id === selectedBarberFilter)
        : barbers;

    return (
        <div className="row">
            {/* SIDEBAR IZQUIERDO */}
            <div className="col-md-3 mb-4">
                <div className="bg-white rounded p-3 shadow-sm sticky-top" style={{top: '20px'}}>
                    <h6 className="fw-bold mb-3">Filtrar por</h6>
                    <div className="list-group list-group-flush">
                        <button className={`list-group-item list-group-item-action border-0 px-2 py-2 mb-1 rounded ${!selectedBarberFilter ? 'bg-dark text-white' : ''}`} onClick={() => setSelectedBarberFilter(null)}>Todos</button>
                        {barbers.map(barber => (
                            <button key={barber._id} className={`list-group-item list-group-item-action border-0 px-2 py-2 mb-1 rounded d-flex align-items-center gap-2 ${selectedBarberFilter === barber._id ? 'bg-dark text-white' : ''}`} onClick={() => setSelectedBarberFilter(barber._id)}>
                                <img src={barber.foto} className="rounded-circle border" style={{width:'25px', height:'25px', objectFit:'cover'}}/>
                                {barber.nombre}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* LISTA PRINCIPAL (ACORDEÓN CORREGIDO: POR DEFECTO OCULTO) */}
            <div className="col-md-9">
                {displayedBarbers.map(barber => {
                    // Verificamos si este barbero es el que está activo
                    const isOpen = activeAccordion === barber._id;

                    return (
                        <div key={barber._id} className="mb-3 bg-white rounded shadow-sm overflow-hidden">
                            {/* HEADER ACORDEÓN (Click para abrir/cerrar) */}
                            <div 
                                className="p-3 d-flex justify-content-between align-items-center cursor-pointer hover-scale"
                                style={{backgroundColor: '#f8f9fa'}}
                                onClick={() => setActiveAccordion(isOpen ? null : barber._id)}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <img src={barber.foto} className="rounded-circle shadow-sm" style={{width:'50px', height:'50px', objectFit:'cover'}}/>
                                    <h6 className="mb-0 fw-bold fs-5">{barber.nombre}</h6>
                                </div>
                                {/* Icono cambia si está abierto o cerrado */}
                                <i className={`bi bi-plus-lg fs-4 text-muted rotate-icon ${isOpen ? 'open' : ''}`}></i>
                            </div>

                            {/* CONTENIDO (SERVICIOS) - CORRECCIÓN: RENDERING CONDICIONAL */}
                            {/* Solo se dibuja en pantalla si isOpen es TRUE */}
                            {isOpen && (
                                <div className="p-3 border-top animate-fade-in">
                                    <div className="row g-3">
                                        {services.map(srv => (
                                            <div key={srv._id} className="col-md-6">
                                                <div className="card h-100 border-0 shadow-sm hover-scale" style={{borderLeft: '5px solid #00cba9'}}>
                                                    <div className="card-body p-3 d-flex flex-column">
                                                        <div className="d-flex justify-content-between"><h6 className="fw-bold mb-1">{srv.nombre}</h6><span className="fw-bold text-success">${srv.precio.toLocaleString('es-CL')}</span></div>
                                                        <small className="text-muted mb-3">{srv.duracion} min</small>
                                                        <button className="btn btn-sm text-white fw-bold w-100 mt-auto" style={{backgroundColor: '#00cba9'}} onClick={() => handleServiceClick(srv, barber)}>Agendar</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* --- MODAL DE PERFIL EXTERNO --- */}
            {externalProfileTrigger && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center animate-fade-in" 
                     style={{backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1050}}>
                     <div className="bg-white rounded-4 shadow-lg overflow-hidden position-relative d-flex flex-column" style={{width: '90%', maxWidth: '700px', maxHeight: '85vh'}}>
                        <div className="position-relative bg-dark text-white p-4 d-flex align-items-end" 
                             style={{height: '200px', backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9), transparent), url(${externalProfileTrigger.foto})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                            <button className="btn-close btn-close-white position-absolute top-0 end-0 m-3" onClick={onCloseExternalProfile}></button>
                            <div>
                                <h2 className="fw-bold mb-0">{externalProfileTrigger.nombre}</h2>
                                <span className="badge bg-warning text-dark">{externalProfileTrigger.especialidad}</span>
                            </div>
                        </div>
                        <div className="p-4 overflow-auto custom-scrollbar">
                            <h5 className="fw-bold mb-3 border-bottom pb-2">Servicios Disponibles</h5>
                            <div className="row g-3">
                                {services.map(srv => (
                                    <div key={srv._id} className="col-md-6">
                                        <div className="card h-100 shadow-sm border-0 bg-light hover-scale">
                                            <div className="card-body d-flex justify-content-between align-items-center">
                                                <div><h6 className="fw-bold mb-1">{srv.nombre}</h6><small className="text-muted">{srv.duracion} min</small></div>
                                                <div className="text-end">
                                                    <div className="fw-bold text-success mb-2">${srv.precio.toLocaleString('es-CL')}</div>
                                                    <button className="btn btn-sm btn-dark text-white py-0" onClick={() => handleServiceClick(srv, externalProfileTrigger)}>Agendar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                     </div>
                </div>
            )}

            {/* --- MODAL WIZARD DE RESERVA (Z-INDEX 1055) --- */}
            {showModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center animate-fade-in" 
                     style={{backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1055}}>
                    <div className="bg-white rounded-4 shadow-lg overflow-hidden d-flex flex-column" style={{width: '95%', maxWidth: '500px', maxHeight: '90vh'}}>
                        
                        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                            <h5 className="mb-0 fw-bold">📅 Reservar Cita</h5>
                            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                        </div>

                        <div className="p-4 overflow-auto custom-scrollbar">
                            {modalStep === 1 && (
                                <>
                                    <div className="alert alert-light border mb-4 shadow-sm d-flex align-items-center gap-3">
                                        <img src={selectedBarberForBooking?.foto} className="rounded-circle" style={{width:'40px', height:'40px', objectFit:'cover'}}/>
                                        <div><strong>{selectedService?.nombre}</strong><div className="small text-muted">{selectedBarberForBooking?.nombre}</div></div>
                                    </div>
                                    <h6 className="fw-bold mb-3">Fecha</h6>
                                    <div className="d-flex overflow-auto pb-3 mb-3 gap-2 hide-scrollbar">
                                        {datesList.map((date, idx) => (
                                            <div key={idx} onClick={() => setSelectedDateIndex(idx)} className={`text-center rounded-3 p-2 flex-shrink-0 cursor-pointer border ${selectedDateIndex === idx ? 'bg-dark text-white' : 'bg-light'}`} style={{minWidth: '70px'}}>
                                                <small className="d-block small text-uppercase">{date.dayName}</small><strong className="fs-4">{date.dayNumber}</strong>
                                            </div>
                                        ))}
                                    </div>
                                    <h6 className="fw-bold mb-3">Horas</h6>
                                    {['morning', 'afternoon', 'evening'].map(block => getGroupedSlots()[block].length > 0 && (
                                        <div key={block} className="mb-2"><small className="text-muted fw-bold text-uppercase">{block==='morning'?'Mañana':block==='afternoon'?'Tarde':'Noche'}</small>
                                            <div className="d-flex flex-wrap gap-2 mt-1">{getGroupedSlots()[block].map(time => (<button key={time} className={`btn btn-sm border-0 ${selectedTime === time ? 'btn-success text-white' : 'bg-light'}`} onClick={() => setSelectedTime(time)}>{time}</button>))}</div>
                                        </div>
                                    ))}
                                    {selectedTime && <button className="btn w-100 text-white fw-bold mt-3" style={{backgroundColor: '#00cba9'}} onClick={() => setModalStep(2)}>Continuar</button>}
                                </>
                            )}
                            {modalStep === 2 && (
                                <form onSubmit={handleReserva}>
                                    <h5 className="fw-bold mb-3">Datos Personales</h5>
                                    <div className="mb-2"><input className="form-control" placeholder="Nombre" required onChange={e => setUserData({...userData, nombre: e.target.value})}/></div>
                                    <div className="mb-2"><input className="form-control" type="email" placeholder="Email" required onChange={e => setUserData({...userData, email: e.target.value})}/></div>
                                    <div className="mb-3"><input className="form-control" type="tel" placeholder="Teléfono" required onChange={e => setUserData({...userData, telefono: e.target.value})}/></div>
                                    <div className="d-flex gap-2"><button type="button" className="btn btn-outline-secondary w-50" onClick={() => setModalStep(1)}>Volver</button><button type="submit" className="btn w-50 text-white fw-bold" style={{backgroundColor: '#00cba9'}}>Confirmar</button></div>
                                </form>
                            )}
                            {modalStep === 3 && reservaFinal && (
                                <div className="text-center py-5"><div className="display-1 text-success mb-3">🎉</div><h3>¡Listo!</h3><p>Reserva confirmada.</p><button className="btn btn-dark w-100" onClick={() => {setShowModal(false); setModalStep(1);}}>Cerrar</button></div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingForm;