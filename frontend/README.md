# 💈 Barba's Kingdom - Sistema de Agendamiento Web

![Status](https://img.shields.io/badge/Status-Completado-success)
![MERN](https://img.shields.io/badge/Stack-MERN-blue)

Aplicación web Full Stack para la gestión y reserva de horas en una barbería moderna. Permite a los usuarios explorar profesionales, visualizar servicios en un formato de acordeón dinámico y agendar citas en tiempo real.

## 🚀 Funcionalidades Principales

- **Flujo de Reserva Interactivo:** Wizard paso a paso con validaciones visuales.
- **Gestión de Barberos:** Perfiles dinámicos con galería de servicios y horarios.
- **Acordeón Inteligente:** Visualización limpia de servicios que se despliega bajo demanda.
- **Seguridad UX:** Alertas de confirmación (SweetAlert2) con manejo avanzado de capas (Z-Index) para evitar conflictos visuales.
- **Historial de Citas:** Módulo de "Mis Reservas" con inicio de sesión simulado (OAuth UI).
- **Sistema de Reseñas:** Visualización de comentarios y valoraciones de clientes.
- **Panel de Administración:** API RESTful preparada para gestión de servicios (Backend).

## 🛠️ Tecnologías Utilizadas

Este proyecto fue desarrollado utilizando el stack **MERN**:

* **Frontend:** React.js, Vite, Bootstrap 5, SweetAlert2.
* **Backend:** Node.js, Express.js.
* **Base de Datos:** MongoDB (Mongoose) con script de *Seeding* para datos iniciales.
* **Control de Versiones:** Git & GitHub.

## 🔧 Instalación y Despliegue Local

Sigue estos pasos para correr el proyecto en tu máquina local:

### 1. Clonar el repositorio
```bash
git clone [https://github.com/TU_USUARIO/barbas-kingdom.git](https://github.com/FJMichea/barbas-kingdom.git)
cd barbas-kingdom

2. Configurar el Backend
Bash

cd backend
npm install
# Asegúrate de tener MongoDB corriendo localmente o configurar tu .env
npm run dev
3. Configurar el Frontend
Abre una nueva terminal:

Bash

cd frontend
npm install
npm run dev
La aplicación estará disponible en: http://localhost:5173

 Vistas Previas
El diseño cuenta con un banner inmersivo, integración con Google Maps y un widget de horarios interactivo.

 Autor
Francisco Michea A. Analista Programador | Ingeniería en Informática