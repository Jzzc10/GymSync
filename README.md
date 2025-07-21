🏋️‍♂️ GymSync
GymSync es una plataforma web y móvil diseñada para modernizar la gestión de entrenamientos en gimnasios. Conecta entrenadores, usuarios y administradores en un ecosistema digital eficiente que automatiza rutinas, mide progreso físico y optimiza la comunicación.

🎯 Objetivo
Automatizar y personalizar rutinas de entrenamiento.

Facilitar el seguimiento del progreso físico.

Mejorar la comunicación entre entrenadores y clientes.

Centralizar la gestión del gimnasio en una plataforma accesible.

📱 Descripción General
Roles
Rol	Funciones principales
Administrador	Gestiona entrenadores, usuarios, membresías y métricas
Entrenador	Crea rutinas, monitorea clientes, ajusta planes
Cliente	Consulta rutinas, registra entrenamientos, sigue progreso

Funcionalidades clave
📅 Calendario de entrenamientos

📈 Gráficos de evolución física

🔔 Notificaciones automáticas

💬 Chat integrado

🧠 Biblioteca multimedia de ejercicios (videos y descripciones)

💡 Motivación
Detectamos la necesidad de digitalizar procesos que aún se gestionan con planillas físicas, WhatsApp o Excel. GymSync busca:

Brindar seguimiento personalizado a los clientes.

Mejorar la eficiencia operativa del gimnasio.

Escalar a cadenas deportivas con inteligencia artificial para rutinas adaptativas futuras.

🧱 Arquitectura Técnica
Frontend
Tecnología: Angular 19.2.9

Componentes: Autenticación JWT, Dashboard, Rutinas, Progreso

Librerías: Angular Material, SweetAlert2, RxJS

Backend
Tecnología: Spring Boot (Java 23)

Base de datos: MySQL

Seguridad: JWT para autenticación, bcrypt para contraseñas cifradas

Servidor: Apache Tomcat 11

⚙️ Requisitos Técnicos
Hardware
Procesador ≥ 2GHz

Memoria RAM ≥ 4GB

Software
Tecnología	Versión Requerida	URL de Descarga
Java	23.0.2	https://jdk.java.net/
Apache Maven	3.9.9	https://maven.apache.org/download.cgi
Node.js	22.13.1	https://nodejs.org/
NPM	10.9.2	https://nodejs.org/
Angular CLI	19.2.9 (global)	npm install -g @angular/cli@19.2.9
MySQL	Última versión estable	https://dev.mysql.com/downloads/
Navegadores	Chrome, Firefox, Edge	Últimas versiones recomendadas
IDE recomendado	Visual Studio Code o IntelliJ IDEA con extensiones para Java y Angular	

👥 Roles y Funcionalidades
Rol	Funciones principales
Cliente	Visualiza rutinas, registra progreso diario, consulta evolución
Entrenador	Crea rutinas personalizadas, monitorea clientes, ajusta planes
Administrador	Alta/baja de usuarios y entrenadores, asigna clientes, gestiona membresías

🗂 Modelo Relacional (Resumen)
Entidades principales: USUARIO, RUTINA, EJERCICIO, RUTINA_EJERCICIO, PROGRESO

Relaciones claras entre clientes, entrenadores, rutinas y progreso.

Ejemplo:

plaintext
Copiar
Editar
USUARIO(1, 'Ana', 'ana@gmail.com', ..., 'cliente')
RUTINA(1, 1, 2, 'Rutina de fuerza inicial')
EJERCICIO(1, 'Sentadillas', 'piernas', ...)
🔧 APIs Disponibles
Recurso	Método	Ruta	Descripción
Usuarios	GET	/api/usuarios	Lista todos los usuarios
POST	/api/usuarios	Crear usuario
PUT	/api/usuarios/{id}	Editar usuario
DELETE	/api/usuarios/{id}	Eliminar usuario
Rutinas	GET	/api/rutinas/cliente/{id}	Rutinas de un cliente
POST	/api/rutinas	Crear rutina
PUT	/api/rutinas/{id}	Editar rutina
Ejercicios	GET	/api/ejercicios	Todos los ejercicios
POST	/api/ejercicios	Crear ejercicio
PUT	/api/ejercicios/{id}	Editar ejercicio
Progreso	GET	/api/progreso/usuario/{id}	Progreso por usuario
POST	/api/progreso	Registrar progreso
PUT	/api/progreso/{id}	Actualizar progreso

🛠️ Instalación y Configuración
1. Prerrequisitos
Java 23.0.2 instalado y configurado

bash
Copiar
Editar
java -version
Apache Maven 3.9.9 configurado

bash
Copiar
Editar
mvn -version
Node.js y NPM instalados

bash
Copiar
Editar
node -v
npm -v
Angular CLI instalado globalmente

bash
Copiar
Editar
npm install -g @angular/cli@19.2.9
MySQL Server y cliente SQL configurados (crear base gymsync).

2. Clonar el proyecto
bash
Copiar
Editar
git clone https://github.com/tuusuario/gymsync.git
cd gymsync
Deberías ver dos carpetas principales:

/frontend → Angular

/backend → Spring Boot

3. Configurar conexión a base de datos
Editar application.properties o application.yml en /backend/src/main/resources:

properties
Copiar
Editar
spring.datasource.url=jdbc:mysql://localhost:3306/gymsync
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password
4. Backend
bash
Copiar
Editar
cd backend
mvn clean install
mvn spring-boot:run
El servidor iniciará en: http://localhost:8080

5. Frontend
bash
Copiar
Editar
cd frontend
npm install
ng serve
La app estará en: http://localhost:4200

🧪 Pruebas y Uso
Regístrate como cliente, entrenador o administrador.

Asigna rutinas y registra progreso.

Observa estadísticas y prueba todas las funcionalidades.

❗ Problemas Comunes y Soluciones
Error	Solución
Cannot connect to DB	Verificar credenciales y puerto MySQL
ng serve no encontrado	Reinstalar Angular CLI globalmente
mvn no encontrado	Configurar correctamente MAVEN_HOME

🧑‍💻 Autor
Jzzc
GitHub: https://github.com/Jzzc10

📄 Licencia
Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE.md para más detalles.