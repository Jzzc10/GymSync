[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

# 🏋️‍♂️ GymSync

Una plataforma web y móvil moderna diseñada para revolucionar la gestión de entrenamientos en gimnasios. Conecta entrenadores, usuarios y administradores en un ecosistema digital eficiente que automatiza rutinas, mide progreso físico y optimiza la comunicación.

## 🎯 Objetivos

- **Automatizar** y personalizar rutinas de entrenamiento
- **Facilitar** el seguimiento del progreso físico
- **Mejorar** la comunicación entre entrenadores y clientes
- **Centralizar** la gestión del gimnasio en una plataforma accesible

## 🚀 Características Principales

- 📅 **Calendario de entrenamientos** - Planifica y organiza sesiones
- 📈 **Gráficos de evolución física** - Visualiza el progreso en tiempo real
- 🔔 **Notificaciones automáticas** - Mantente al día con recordatorios
- 🧠 **Biblioteca multimedia** - Videos y descripciones de ejercicios
- 🔐 **Autenticación segura** - Sistema JWT con encriptación bcrypt

## 👥 Roles del Sistema

| Rol | Funciones Principales |
|-----|---------------------|
| **Cliente** | Visualiza rutinas, registra progreso diario, consulta evolución |
| **Entrenador** | Crea rutinas personalizadas, monitorea clientes, ajusta planes |
| **Administrador** | Gestiona usuarios, entrenadores, membresías y métricas generales |

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** Angular 19.2.9
- **UI Library:** Angular Material
- **Librerías:** RxJS, SweetAlert2
- **Autenticación:** JWT

### Backend
- **Framework:** Spring Boot (Java 23)
- **Base de Datos:** MySQL
- **Servidor:** Apache Tomcat 11
- **Seguridad:** JWT + bcrypt

## 📋 Requisitos del Sistema

### Hardware Mínimo
- Procesador ≥ 2GHz
- Memoria RAM ≥ 4GB

### Software Requerido

| Tecnología | Versión | Enlace de Descarga |
|------------|---------|-------------------|
| Java | 23.0.2 | [Oracle JDK](https://jdk.java.net/) |
| Apache Maven | 3.9.9 | [Maven Download](https://maven.apache.org/download.cgi) |
| Node.js | 22.13.1 | [Node.js](https://nodejs.org/) |
| Angular CLI | 19.2.9 | `npm install -g @angular/cli@19.2.9` |
| MySQL | Última estable | [MySQL Downloads](https://dev.mysql.com/downloads/) |

## 🚀 Instalación y Configuración

### 1. Verificar Prerrequisitos

```bash
# Verificar Java
java -version

# Verificar Maven
mvn -version

# Verificar Node.js y NPM
node -v
npm -v

# Instalar Angular CLI globalmente
npm install -g @angular/cli@19.2.9
```

### 2. Clonar el Repositorio

```bash
git clone https://github.com/Jzzc10/gymsync.git
cd gymsync
```

### 3. Configurar Base de Datos

Crear base de datos MySQL:
```sql
CREATE DATABASE gymsync;
```

Editar `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gymsync
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password
```

### 4. Ejecutar Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

El servidor estará disponible en: `http://localhost:8080`

### 5. Ejecutar Frontend

```bash
cd frontend
npm install
ng serve
```

La aplicación estará disponible en: `http://localhost:4200`

## 📚 API Endpoints

| Recurso | Método | Endpoint | Descripción |
|---------|--------|----------|-------------|
| **Usuarios** | GET | `/api/usuarios` | Lista todos los usuarios |
| | POST | `/api/usuarios` | Crear nuevo usuario |
| | PUT | `/api/usuarios/{id}` | Editar usuario |
| | DELETE | `/api/usuarios/{id}` | Eliminar usuario |
| **Rutinas** | GET | `/api/rutinas/cliente/{id}` | Rutinas de un cliente |
| | POST | `/api/rutinas` | Crear nueva rutina |
| | PUT | `/api/rutinas/{id}` | Editar rutina |
| **Ejercicios** | GET | `/api/ejercicios` | Todos los ejercicios |
| | POST | `/api/ejercicios` | Crear ejercicio |
| **Progreso** | GET | `/api/progreso/usuario/{id}` | Progreso por usuario |
| | POST | `/api/progreso` | Registrar progreso |

## 🗄️ Modelo de Datos

El sistema maneja las siguientes entidades principales:

- **USUARIO** - Información de clientes, entrenadores y administradores
- **RUTINA** - Planes de entrenamiento personalizados
- **EJERCICIO** - Biblioteca de ejercicios con descripciones
- **RUTINA_EJERCICIO** - Relación entre rutinas y ejercicios
- **PROGRESO** - Registro de evolución física de los usuarios

## 🧪 Uso de la Aplicación

1. **Registro** - Crea tu cuenta como cliente, entrenador o administrador
2. **Asignación** - Los entrenadores crean y asignan rutinas personalizadas
3. **Seguimiento** - Los clientes registran su progreso diario
4. **Análisis** - Visualiza estadísticas y evolución a través de gráficos

## ❗ Problemas Comunes

| Error | Solución |
|-------|----------|
| `Cannot connect to DB` | Verificar credenciales y puerto de MySQL |
| `ng serve no encontrado` | Reinstalar Angular CLI globalmente |
| `mvn no encontrado` | Configurar correctamente `MAVEN_HOME` |

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea tu rama de característica (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📈 Roadmap Futuro

- 🤖 **Inteligencia Artificial** para rutinas adaptativas
- 📱 **App móvil nativa** para iOS y Android
- 🏢 **Escalabilidad** para cadenas de gimnasios
- 📊 **Analytics avanzados** y reportes

## 👨‍💻 Autor

**Jzzc10**
- GitHub: [@Jzzc10](https://github.com/Jzzc10)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE.md](LICENSE.md) para más detalles.

---

⭐ Si este proyecto te fue útil, ¡dale una estrella en GitHub!

📧 Para preguntas o sugerencias, no dudes en abrir un [issue](https://github.com/Jzzc10/gymsync/issues).
