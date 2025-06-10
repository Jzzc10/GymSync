// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'http://localhost:8080/api', // Cambiar cuando tenga servidor de producción
  appName: 'GymSync'
};

//  Servicios en la Nube
// Heroku: https://tu-app.herokuapp.com
// Railway: https://tu-app.up.railway.app
// Render: https://tu-app.onrender.com
// Google Cloud Platform: https://tu-proyecto.appspot.com
// AWS: https://tu-app.elasticbeanstalk.com

// Desarrollo
// apiUrl: 'http://localhost:8080/api'

// // Después del despliegue en Heroku
// apiUrl: 'https://gymsync-backend.herokuapp.com/api'

// Desarrollo (usa environment.ts)
// ng serve

// Build de producción (usa environment.prod.ts)
// ng build --configuration=production

// Build de desarrollo
// ng build --configuration=development