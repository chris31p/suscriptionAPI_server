# 🛠️ GreenMarket - Backend (Node.js + Express.js)

Desarrollar una aplicación FullStack de comercio electrónico que incluya todos los elementos esenciales para gestionar un negocio en línea desde el lado del servidor.

# Objetivos:
- Manejo de rutas en el servidor (Backend) para gestionar las solicitudes y respuestas entre el cliente y el servidor.
- Gestión y flujo de datos en MongoDB, lo que te permitirá almacenar, consultar y manipular información de manera eficiente y segura.
- 
Este repositorio contiene el **backend** de GreenMarket 🥦, una API REST desarrollada con **Node.js + Express.js**. Proporciona autenticación, gestión de productos y manejo de pagos con **Stripe**.

---

# Despliegue en Netlify

**Link de la aplicación:**

[(https://apigreenmarket.netlify.app/)](https://apigreenmarket.netlify.app/)

---

## 🚀 **Tecnologías Implementadas**
- **🛠️ Node.js + Express.js** - Framework backend para API REST.
- **🔐 JWT + bcryptjs** - Autenticación y seguridad.
- **🗄️ MongoDB + Mongoose** - Base de datos y ORM.
- **📡 CORS** - Permitir acceso desde el frontend.
- **💳 Stripe** - Procesamiento de pagos (Modo de prueba).

---

## ✅ **Requerimientos**
Antes de iniciar, asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [MongoDB](https://www.mongodb.com/) (local o en MongoDB Atlas)
- [Stripe CLI](https://stripe.com/docs/stripe-cli) (para pruebas de pago)

---

## 📦 **Instalación y Ejecución**
Para iniciar el backend, sigue estos pasos:

1️⃣ Clonar el repositorio

    git clone https://github.com/tu-usuario/frontApp-server.git
    cd frontApp-server

2️⃣ Instalar dependencias

    npm install

3️⃣ Configurar variables de entorno (por ejemplo)

    FRONTEND_URL=url_backend_vercel
    MONGODB_URI=mongodb://localhost:27017/nombre_bd
    RESEND_API=tu_key_secreta
    STRIPE_SECRET_KEY=tu_key_secreta_stripe
    SECRET_KEY_ACCESS_TOKEN=clave_random
    SECRET_KEY_REFRESH_TOKEN=clave_random
    CLOUDINARY_CLOUD_NAME=key_de_cloudinary
    CLOUDINARY_API_KEY=key_de_cloudinary
    CLOUDINARY_API_SECRET_KEY=key_secreta_cloudinary
    STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY=key_webhook_stripe

  4️⃣ Ejecutar el servidor

      npm run dev
El backend estará disponible en http://localhost:4000/api

  💳 Configuración de Stripe
Si deseas realizar pruebas de pago con Stripe, abre una nueva terminal y ejecuta:

    stripe listen --forward-to localhost:4000/api/checkout/webhook --events=charge.succeeded


