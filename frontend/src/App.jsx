import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ServicesManager from "./components/ServicesManager";
import BookingForm from "./components/BookingForm";
import 'bootstrap/dist/css/bootstrap.min.css';

const ClientHome = () => {
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [showHours, setShowHours] = useState(false);
  const [activeProfileBarber, setActiveProfileBarber] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  
  // ESTADOS DE USUARIO (LOGIN SOCIAL SIMULADO)
  const [currentUser, setCurrentUser] = useState(null); // null = no logueado
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showMyReservations, setShowMyReservations] = useState(false);
  const [myReservationsList, setMyReservationsList] = useState([]);

  // DATA FALSA DE RESEÑAS
  const generateReviews = () => {
      const baseReviews = [
          { autor: "Felipe M.", texto: "Excelente servicio, muy puntuales.", rating: 5 },
          { autor: "Andrea S.", texto: "Mucha paciencia con los niños.", rating: 5 },
          { autor: "Carlos D.", texto: "El perfilado de barba quedó impecable.", rating: 4 },
          { autor: "Esteban Q.", texto: "Diego es un crack con los diseños.", rating: 5 },
          { autor: "Matias R.", texto: "Buen ambiente y buena música.", rating: 5 },
          { autor: "Jose L.", texto: "Rápido y profesional.", rating: 4 }
      ];
      let allReviews = [];
      for(let i=0; i<3; i++) {
          baseReviews.forEach((rev, idx) => {
              allReviews.push({
                  id: idx + (i*6),
                  autor: rev.autor, rating: rev.rating, texto: rev.texto, fecha: `Hace ${idx + 1 + i} semanas`
              });
          });
      }
      return allReviews;
  };
  const reviews = generateReviews();

  useEffect(() => {
    fetch('http://localhost:4000/api/barbers').then(res => res.json()).then(data => setBarbers(data));
    fetch('http://localhost:4000/api/services').then(res => res.json()).then(data => setServices(data));
  }, []);

  // FUNCIÓN SIMULADA DE LOGIN SOCIAL
  const handleSocialLogin = () => {
      // Simula que Google nos devolvió este usuario
      const mockUser = {
          nombre: "Francisco Michea",
          email: "usuario@ejemplo.com", // Usaremos este email para buscar reservas
          foto: "https://ui-avatars.com/api/?name=Francisco+Michea&background=0D8ABC&color=fff"
      };
      setCurrentUser(mockUser);
      setShowLoginModal(false);
  };

  // FUNCIÓN PARA VER MIS RESERVAS
  const fetchMyReservations = async () => {
      if (!currentUser) return;
      // En una app real, usaríamos el email real del usuario logueado
      // Para pruebas, si no has creado reservas con "usuario@ejemplo.com", no saldrá nada.
      // Así que buscamos por ese email o traemos todas si quieres probar (ajusta el backend si necesitas)
      const res = await fetch(`http://localhost:4000/api/reservations?email=${currentUser.email}`);
      const data = await res.json();
      setMyReservationsList(data);
      setShowMyReservations(true);
  };

  return (
    <div className="min-vh-100" style={{backgroundColor: '#f8f9fa'}}>
      
      {/* NAVBAR */}
      <nav className="navbar navbar-white bg-white shadow-sm mb-4 py-3 sticky-top">
        <div className="container">
          <div className="d-flex align-items-center gap-2">
              <span className="navbar-brand fw-bold fs-5 mb-0">Barba's Kingdom</span>
          </div>
          
          {/* ZONA DE USUARIO */}
          <div>
              {currentUser ? (
                  <div className="d-flex align-items-center gap-3">
                      <span className="small text-muted cursor-pointer hover-scale fw-bold" onClick={fetchMyReservations}>
                          <i className="bi bi-calendar-check me-1"></i> Mis Reservas
                      </span>
                      <div className="d-flex align-items-center gap-2 border-start ps-3">
                          <img src={currentUser.foto} className="rounded-circle" style={{width:'32px'}}/>
                          <span className="small fw-bold">{currentUser.nombre}</span>
                      </div>
                      <button className="btn btn-link text-muted p-0 small text-decoration-none" onClick={() => setCurrentUser(null)}>(Salir)</button>
                  </div>
              ) : (
                  <span className="small text-muted cursor-pointer hover-scale fw-bold" onClick={() => setShowLoginModal(true)}>
                      <i className="bi bi-person-circle me-1"></i> Iniciar Sesión
                  </span>
              )}
          </div>
        </div>
      </nav>

      <div className="container pb-5">
        <div className="row g-4 mb-4">
          {/* BANNER IZQUIERDO */}
          <div className="col-lg-8">
            <div className="bg-white rounded shadow-sm overflow-hidden h-100 position-relative">
                <div style={{height: '280px', overflow: 'hidden'}}>
                    <img src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1000" className="w-100 h-100 object-fit-cover" style={{filter: 'brightness(0.8)'}}/>
                </div>
                <div className="p-4 pt-5 position-relative">
                    <div className="position-absolute bg-white p-1 rounded-circle shadow" style={{width: '130px', height: '130px', top: '-65px', left: '30px', zIndex: 10}}>
                         <div className="w-100 h-100 rounded-circle overflow-hidden border d-flex align-items-center justify-content-center bg-white">
                            <img src="/logo.png" alt="Logo" style={{width:'100%', height:'100%', objectFit:'contain'}} onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='block'}}/>
                            <i className="bi bi-scissors fs-1 text-dark" style={{display:'none'}}></i>
                         </div>
                    </div>
                    <div style={{marginLeft: '150px'}}>
                        <h2 className="fw-bold mb-1 text-dark">Barba's Kingdom</h2>
                        <div className="d-flex align-items-center gap-2" onClick={() => setShowReviews(true)} style={{cursor: 'pointer'}}>
                            <div className="text-warning">★★★★★</div>
                            <span className="text-muted small text-decoration-underline hover-scale">(Ver 18 reseñas)</span>
                            <span className="badge bg-success bg-opacity-10 text-success border border-success ms-2">Abierto ahora</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* TARJETA DERECHA */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100">
                <div style={{height: '160px', borderRadius: '4px 4px 0 0', overflow:'hidden'}}>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13374.878536098055!2d-70.5977!3d-32.8335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9688031070af8b75%3A0x629555192131238!2sLos%20Andes%2C%20Valpara%C3%ADso!5e0!3m2!1ses!2scl!4v1700000000000!5m2!1ses!2scl" width="100%" height="100%" style={{border:0}} loading="lazy"></iframe>
                </div>
                <div className="card-body position-relative">
                    <p className="mb-2 text-muted small"><i className="bi bi-geo-alt-fill me-2 text-success"></i> Av. Santa Teresa 1500, Los Andes</p>
                    <p className="mb-2 text-muted small"><i className="bi bi-phone me-2 text-success"></i> 945349271</p>
                    <div className="position-relative mb-3 d-inline-block">
                        <span className="text-decoration-underline text-dark fw-bold small cursor-pointer" onMouseEnter={() => setShowHours(true)} onMouseLeave={() => setShowHours(false)}>
                            <i className="bi bi-clock me-2 text-success"></i> Ver horario de atención
                        </span>
                        {showHours && (
                            <div className="position-absolute start-0 bg-white shadow-lg p-3 rounded border animate-fade-in" style={{top: '100%', width: '250px', zIndex: 100, fontSize: '0.8rem'}}>
                                <h6 className="fw-bold border-bottom pb-2 mb-2">Horario Semanal</h6>
                                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map(d => <div key={d} className="d-flex justify-content-between"><span>{d}:</span> <span>10:00 - 20:00</span></div>)}
                                <div className="d-flex justify-content-between"><span>Sábado:</span> <span>10:00 - 18:00</span></div>
                                <div className="d-flex justify-content-between text-danger"><span>Domingo:</span> <span>Cerrado</span></div>
                            </div>
                        )}
                    </div>
                    <a href="https://wa.me/569945349271" target="_blank" className="btn btn-outline-success w-100 fw-bold btn-sm mb-4"><i className="bi bi-whatsapp me-2"></i> ¡Contáctanos por Whatsapp!</a>
                    <hr className="text-muted opacity-25"/>
                    <h6 className="fw-bold small mb-3">Profesionales ({barbers.length})</h6>
                    <div className="d-flex gap-2 overflow-auto pb-2 hide-scrollbar">
                        {barbers.map(barber => (
                            <div key={barber._id} className="position-relative cursor-pointer hover-scale" onClick={() => setActiveProfileBarber(barber)} title={`Ver perfil de ${barber.nombre}`}>
                                <img src={barber.foto} className="rounded-circle border border-2 border-white shadow-sm" style={{width:'45px', height:'45px', objectFit:'cover'}} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        </div>

        <div className="mb-4"><div className="input-group shadow-sm"><span className="input-group-text bg-white border-0 ps-3"><i className="bi bi-search text-muted"></i></span><input type="text" className="form-control border-0 py-2" placeholder="¿Qué servicio buscas?" /></div></div>

        {/* BOOKING FORM */}
        <BookingForm barbers={barbers} services={services} externalProfileTrigger={activeProfileBarber} onCloseExternalProfile={() => setActiveProfileBarber(null)} />

      </div>
      
      {/* --- MODAL LOGIN (SIMULADO) --- */}
      {showLoginModal && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center animate-fade-in" style={{backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 3500}}>
              <div className="bg-white rounded-4 shadow-lg p-5 text-center" style={{width: '90%', maxWidth: '400px'}}>
                  <h3 className="fw-bold mb-3">Bienvenido</h3>
                  <p className="text-muted mb-4">Inicia sesión para gestionar tus reservas</p>
                  
                  <button className="btn btn-outline-dark w-100 mb-2 d-flex align-items-center justify-content-center gap-2 py-2" onClick={handleSocialLogin}>
                      <i className="bi bi-google"></i> Continuar con Google
                  </button>
                  <button className="btn btn-outline-primary w-100 mb-3 d-flex align-items-center justify-content-center gap-2 py-2" onClick={handleSocialLogin}>
                      <i className="bi bi-facebook"></i> Continuar con Facebook
                  </button>
                  <button className="btn btn-link text-muted btn-sm" onClick={() => setShowLoginModal(false)}>Cancelar</button>
              </div>
          </div>
      )}

      {/* --- MODAL MIS RESERVAS --- */}
      {showMyReservations && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center animate-fade-in" style={{backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 3500}}>
              <div className="bg-white rounded-4 shadow-lg d-flex flex-column" style={{width: '90%', maxWidth: '600px', maxHeight: '80vh'}}>
                  <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                      <h5 className="mb-0 fw-bold">📅 Mis Reservas</h5>
                      <button className="btn-close" onClick={() => setShowMyReservations(false)}></button>
                  </div>
                  <div className="p-4 overflow-auto custom-scrollbar bg-light">
                      {myReservationsList.length === 0 ? (
                          <div className="text-center py-5 text-muted">
                              <i className="bi bi-calendar-x fs-1 mb-3"></i>
                              <p>No tienes reservas registradas con este correo.</p>
                              <small>Prueba haciendo una reserva nueva con <b>usuario@ejemplo.com</b></small>
                          </div>
                      ) : (
                          myReservationsList.map(res => (
                              <div key={res._id} className="card border-0 shadow-sm mb-3">
                                  <div className="card-body">
                                      <div className="d-flex justify-content-between align-items-center mb-2">
                                          <h6 className="fw-bold mb-0 text-dark">{res.servicio}</h6>
                                          <span className="badge bg-success">Confirmada</span>
                                      </div>
                                      <div className="text-muted small mb-3">
                                          <i className="bi bi-scissors me-1"></i> Barbero: <strong>{res.barbero}</strong>
                                      </div>
                                      <div className="d-flex gap-3 text-secondary small border-top pt-2">
                                          <span><i className="bi bi-calendar-event me-1"></i> {res.fecha}</span>
                                          <span><i className="bi bi-clock me-1"></i> {res.hora}</span>
                                          <span className="fw-bold text-dark ms-auto">${res.precio.toLocaleString('es-CL')}</span>
                                      </div>
                                  </div>
                              </div>
                          ))
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* --- MODAL RESEÑAS --- */}
      {showReviews && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center animate-fade-in" style={{backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 3500}}>
              <div className="bg-white rounded-4 shadow-lg overflow-hidden d-flex flex-column" style={{width: '90%', maxWidth: '500px', maxHeight: '80vh'}}>
                  <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                      <h5 className="mb-0 fw-bold">Opiniones de Clientes</h5>
                      <button className="btn-close" onClick={() => setShowReviews(false)}></button>
                  </div>
                  <div className="p-4 overflow-auto custom-scrollbar">
                      <div className="d-flex align-items-center gap-3 mb-4">
                          <h1 className="fw-bold mb-0">5.0</h1>
                          <div><div className="text-warning">★★★★★</div><small className="text-muted">Basado en 18 reseñas</small></div>
                      </div>
                      {reviews.map(rev => (
                          <div key={rev.id} className="mb-3 pb-3 border-bottom">
                              <div className="d-flex justify-content-between mb-1"><strong className="small">{rev.autor}</strong><small className="text-muted" style={{fontSize: '0.7rem'}}>{rev.fecha}</small></div>
                              <div className="text-warning small mb-1">{'★'.repeat(rev.rating)}</div>
                              <p className="small mb-0 text-secondary">{rev.texto}</p>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}
      
      {/* SIN BOTÓN DE ADMIN (ELIMINADO) */}
    </div>
  );
};

// Mantenemos la ruta Admin activa por si tú quieres entrar manualmente escribiendo /admin
const AdminPanel = () => (
  <div className="container py-5"><div className="d-flex justify-content-between align-items-center mb-4"><h2>⚙️ Panel de Administración</h2><Link to="/" className="btn btn-outline-dark">← Volver</Link></div><ServicesManager /></div>
);

function App() {
  return (
    <BrowserRouter><Routes><Route path="/" element={<ClientHome />} /><Route path="/admin" element={<AdminPanel />} /></Routes></BrowserRouter>
  );
}

export default App;