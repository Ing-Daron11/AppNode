# AppNode

## 📌 Descripción
Este proyecto es una plataforma para la gestión de renta de equipos, permitiendo a los usuarios alquilar dispositivos, administrar reservas y controlar la disponibilidad de equipos en tiempo real. Cuenta con autenticación y autorización basada en roles para garantizar un acceso seguro a las funcionalidades del sistema.

## 🚀 Tecnologías Utilizadas
- **Backend**: Node.js, Express
- **Base de Datos**: MongoDB
- **Autenticación**: JWT y roles de usuario
- **Despliegue**: Vercel

## 📂 Estructura del Proyecto
```
AppNode/
│── src/
│   ├── constants/      # Definición de constantes globales
│   ├── controllers/    # Lógica de controladores
│   ├── exceptions/     # Manejo de excepciones personalizadas
│   ├── interfaces/     # Definición de interfaces y tipos
│   ├── lib/            # Librerías auxiliares y utilidades
│   ├── middlewares/    # Middleware de autenticación y validaciones
│   ├── models/         # Modelos de base de datos
│   ├── routes/         # Definición de rutas
│   ├── schemas/        # Validaciones de datos
│   ├── services/       # Lógica de negocio y servicios
│   ├── index.ts        # Punto de entrada principal
│── README.md           # Documentación del proyecto

```

## 📖 Instalación y Configuración
### 1️⃣ Clonar el Repositorio
```sh
git clone https://github.com/Ing-Daron11/AppNode.git
cd AppNode
```

### 2️⃣ Instalar Dependencias
```sh
npm install
```

### 3️⃣ Ejecutar el Proyecto
```sh
yarn dev
```
La aplicación estará disponible en: `http://localhost:3000`

### Endpoints del Módulo de Usuarios


| Método | Endpoint         | Descripción | Protegido |
|--------|----------------|-------------|-----------|
| GET    | `/users/`       | Listar todos los usuarios | ✅ ADMIN |
| POST   | `/users/`       | Crear un usuario | ✅ ADMIN |
| POST   | `/users/login`  | Iniciar sesión | ❌ |
| GET    | `/users/:id`    | Obtener usuario por ID | ✅ ADMIN |
| PUT    | `/users/:id`    | Actualizar usuario | ✅ ADMIN |
| DELETE | `/users/:id`    | Eliminar usuario | ✅ ADMIN |

### Endpoints del Módulo de Computadores

La siguiente tabla describe los endpoints disponibles para la gestión de computadores en la API.

| **Método** | **Endpoint**               | **Descripción**                               | **Protegido** |
|------------|---------------------------|----------------------------------------------|--------------|
| **GET**    | `/computer/`               | Listar todos los computadores               | ✅ Requiere autenticación |
| **POST**   | `/computer/`               | Crear un computador                         | ✅ Requiere rol de ADMIN |
| **GET**    | `/computer/:id`            | Obtener un computador por ID                | ✅ Requiere autenticación |
| **GET**    | `/computer/category/:category` | Obtener computadores por categoría     | ✅ Requiere autenticación |
| **PUT**    | `/computer/:id`            | Actualizar un computador                    | ✅ Requiere rol de ADMIN |
| **PATCH**  | `/computer/:id/status`     | Actualizar el estado de un computador       | ✅ Requiere rol de ADMIN |
| **DELETE** | `/computer/:id`            | Eliminar un computador                      | ✅ Requiere rol de ADMIN |

### Endpoints del Módulo de Renta

| Método | Endpoint      | Descripción                     | Protegido |
|--------|-------------|---------------------------------|-----------|
| GET    | `/rental/`   | Listar todos los alquileres    | ✅ |
| POST   | `/rental/`   | Crear un alquiler             | ✅  |
| GET    | `/rental/:id` | Obtener un alquiler por ID    | ✅ |
| PUT    | `/rental/:id` | Actualizar un alquiler       | ✅  |
| DELETE | `/rental/:id` | Eliminar un alquiler         | ✅  |



## 🚀 Despliegue en Vercel
Cada `push` a la rama `main` despliega automáticamente en Vercel. 

🔗 **URL de producción**: [https://app-node.vercel.app](https://app-node-phi.vercel.app/)

## 👤 Autores
- [**Daron**](https://github.com/Ing-Daron11)
- [**Miguel**](https://github.com/Miguel-23-ing)
- [**David**](https://github.com/MalteDs)

📌 **Notas adicionales**: Para cualquier consulta, revisa la documentación oficial de **Node.js**, **Express**, **Vercel** y **MongoDB**.

