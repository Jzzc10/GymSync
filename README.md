# 🏋️‍♂️ GymSync

<!-- Estado del proyecto -->

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

<!-- Tecnologías -->
![Java](https://img.shields.io/badge/java-23.0.2-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?logo=spring)
![Angular](https://img.shields.io/badge/Angular-17.3.17-red?logo=angular)
![MySQL](https://img.shields.io/badge/MySQL-latest-blue?logo=mysql)

Una plataforma web y móvil moderna diseñada para revolucionar la gestión de entrenamientos en gimnasios. Conecta entrenadores, usuarios y administradores en un ecosistema digital eficiente que automatiza rutinas, mide progreso físico y optimiza la comunicación.

## 🎯 Objetivos

- **Automatizar** y personalizar rutinas de entrenamiento
- **Facilitar** el seguimiento del progreso físico
- **Mejorar** la comunicación entre entrenadores y clientes
- **Centralizar** la gestión del gimnasio en una plataforma accesible

---

📋 Tabla de Contenidos

🎯 Objetivos
🚀 Características Principales
🌐 Demo y Capturas
🏗️ Arquitectura del Sistema
👥 Roles del Sistema
🛠️ Stack Tecnológico
📋 Requisitos del Sistema
🚀 Instalación Detallada
🐳 Docker Setup
📚 Documentación API
🔐 Seguridad
🧪 Testing
⚡ Performance
🚀 Deployment
❗ Troubleshooting
🤝 Contribuciones
📈 Roadmap
📄 Licencia

---

🎯 Objetivos

- Automatizar y personalizar rutinas de entrenamiento
- Facilitar el seguimiento del progreso físico
- Mejorar la comunicación entre entrenadores y clientes
- Centralizar la gestión del gimnasio en una plataforma accesible

## 🚀 Características Principales

- 📅 **Calendario de entrenamientos** - Planifica y organiza sesiones
- 📈 **Gráficos de evolución física** - Visualiza el progreso en tiempo real
- 📱 **Diseño responsive** - Funciona en dispositivos móviles y desktop
- 🔐 **Autenticación segura** - Sistema JWT con encriptación bcrypt


## 🎮 Demo en Vivo

> Nota: La aplicación debe estar ejecutándose localmente para acceder a todas las funcionalidades.

Frontend: http://localhost:4200
Backend API: http://localhost:8080
Swagger UI: http://localhost:8080/swagger-ui.html

## 🏗️ Arquitectura del Sistema
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐
│   Frontend      │◄──────────────────►│   Backend       │
│   Angular 17    │                     │   Spring Boot   │
│   Port: 4200    │                     │   Port: 8080    │
└─────────────────┘                     └─────────────────┘
                                                 │
                                                 │ JDBC
                                                 ▼
                                        ┌─────────────────┐
                                        │   Database      │
                                        │   MySQL         │
                                        │   Port: 3306    │
                                        └─────────────────┘

Componentes Principales

Frontend: SPA con Angular, Material Design, RxJS para gestión de estado
Backend: API REST con Spring Boot, seguridad JWT, validación de datos
Base de Datos: MySQL con diseño normalizado en 3FN
Autenticación: JWT con refresh tokens y bcrypt para contraseñas

## 👥 Roles del Sistema

| Rol | Funciones Principales |
|-----|---------------------|
| **Cliente** | Visualiza rutinas, registra progreso diario, consulta evolución |
| **Entrenador** | Crea rutinas personalizadas, monitorea clientes, ajusta planes |
| **Administrador** | Gestiona usuarios, entrenadores, membresías y métricas generales |

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** Angular 17.3.17
- **UI Library:** Angular Material
- **Librerías:** RxJS, SweetAlert2
- **Autenticación:** JWT

### Backend
- **Framework:** Spring Boot 3.x (Java 23)
- **Base de Datos:** MySQL con JPA/Hibernate
- **Servidor:** Apache Tomcat 11 (embebido)
- **Seguridad:** Spring Security + JWT + bcrypt
- **Documentación**: Swagger/OpenAPI 3
- **Testing**: JUnit 5 + Mockito

DevOps & Tools

Control de Versiones: Git + GitHub
Build Tools: Maven (Backend), npm (Frontend)
Database Tools: MySQL Workbench
API Testing: Postman, Swagger UI
IDE Recomendado: IntelliJ IDEA, VS Code

## 📋 Requisitos del Sistema

### Hardware Mínimo
- Procesador ≥ 2GHz
- Memoria RAM ≥ 4GB

### Software Requerido

| Tecnología | Versión minima | Versión Recomendada | Enlace de Descarga |
|------------|---------|-------------------|
| Java JDK | 17+ | 23.0.2 | [Oracle JDK](https://jdk.java.net/) |
| Apache Maven | 3.6+ | 3.9.9 | [Maven Download](https://maven.apache.org/download.cgi) |
| Node.js | 18+ | 22.13.1 | [Node.js](https://nodejs.org/) |
| Angular CLI | 17+ | 17.3.17 | `npm install -g @angular/cli@17.3.17` |
| MySQL | 8.0+ | Latest | [MySQL Downloads](https://dev.mysql.com/downloads/) |
| Git | 2.30+ | Latest | [Git Download](https://git-scm.com/downloads) |

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

# Verificar Angular
ng version
```

<img width="674" height="723" alt="versiones" src="https://github.com/user-attachments/assets/d75c72f2-7ea3-474d-9892-9ceeef035984" />



### 2. Clonar el Repositorio

```bash
git clone https://github.com/Jzzc10/gymsync.git
cd gymsync
```
<img width="655" height="316" alt="clonar_repo" src="https://github.com/user-attachments/assets/9a71c36c-ffbe-4579-8126-5ca15828cdaf" />

### 3. Configurar Base de Datos

Crear base de datos MySQL:
```sql
CREATE DATABASE gymsync CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'tu_usuario'@'localhost' IDENTIFIED BY 'tu_password';
GRANT ALL PRIVILEGES ON gymsync.* TO 'tu_usuario'@'localhost';
FLUSH PRIVILEGES;
```

Configurar application.properties
Editar `backend/src/main/resources/application.properties`:
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/gymsync?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# JWT Configuration
jwt.secret=tu_clave_secreta_muy_larga_y_segura
jwt.expiration=86400000

# Server Configuration
server.port=8080
server.servlet.context-path=/

# Swagger Configuration
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
```
<img width="1112" height="770" alt="bd_mysql" src="https://github.com/user-attachments/assets/327bb33c-b5b5-4896-852a-2b760eeb12fa" />

Scripts SQL
El script sql estan en `/src/main/resources/sql/`
<img width="879" height="412" alt="image" src="https://github.com/user-attachments/assets/f1c5326f-8f0c-4068-87ce-fba300f724a5" />

### 4. Ejecutar Backend

```bash
cd backend

# Limpiar e instalar dependencias
mvn clean install

# Ejecutar en modo desarrollo
mvn spring-boot:run

```
<img width="857" height="427" alt="mvn_clean_install" src="https://github.com/user-attachments/assets/8a279d11-6e75-4a37-b612-49e709104794" />
<img width="853" height="131" alt="mvn_spring_boot_run" src="https://github.com/user-attachments/assets/ddd30ebd-553d-4dea-973e-1f1376b5a185" />

✅ Backend listo: http://localhost:8080

RECUERDA! La base de datos y tu usuario tiene que estar creado y arrancado antes.

<img width="1111" height="564" alt="home_page_spring_boot" src="https://github.com/user-attachments/assets/a5096bdd-7f66-45a9-ad14-9e719b99b6a0" />


### 5. Ejecutar Frontend

Abre nueva terminal:
```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
ng serve

# O ejecutar en modo producción
ng serve --configuration production
```

<img width="741" height="293" alt="image" src="https://github.com/user-attachments/assets/4651f63b-3709-4517-9ed3-c4fc387b14d5" />
<img width="1222" height="1316" alt="image" src="https://github.com/user-attachments/assets/d89ca7a3-2b83-47ea-b4f5-4177bb7fbed5" />


✅ Frontend listo: http://localhost:4200

## 📚 Documentación API
Swagger UI (Recomendado)
Una vez que el backend esté ejecutándose:

- Interfaz Swagger: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/api-docs
- OpenAPI YAML: http://localhost:8080/api-docs.yaml

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
| `Port 8080 was already in use` | Hacer un taskkil en el puerto 8080 |
<img width="638" height="152" alt="image" src="https://github.com/user-attachments/assets/73f9f56d-397c-4f84-b1a4-6140761e1b32" />

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
- Notificaciones rutina
- Chat Integrado
    • Normalizar base de datos (3FN)
    • Diagrama de Gantt
    • Mockup o wireframe
    • Biblioteca multimedia - Videos y descripciones de ejercicios
    • Manual de usuario

## 👨‍💻 Autor

**Jzzc10**
- GitHub: [@Jzzc10](https://github.com/Jzzc10)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE.md](LICENSE.md) para más detalles.

---

⭐ Si este proyecto te fue útil, ¡dale una estrella en GitHub!

📧 Para preguntas o sugerencias, no dudes en abrir un [issue](https://github.com/Jzzc10/gymsync/issues).
