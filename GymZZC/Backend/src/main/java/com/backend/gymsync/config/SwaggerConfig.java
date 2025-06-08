package com.backend.gymsync.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("GymSync API")
                        .version("1.0.0")
                        .description("API REST para la gestión de rutinas de gimnasio, progreso de entrenamientos y usuarios")
                        .contact(new Contact()
                                .name("Equipo GymSync")
                                .email("support@gymsync.com")
                                .url("https://gymsync.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("Servidor de desarrollo"),
                        new Server()
                                .url("https://api.gymsync.com")
                                .description("Servidor de producción")))
                .tags(List.of(
                        new Tag().name("Usuarios").description("Gestión de usuarios, entrenadores y clientes"),
                        new Tag().name("Ejercicios").description("Catálogo de ejercicios disponibles"),
                        new Tag().name("Rutinas").description("Gestión de rutinas de entrenamiento"),
                        new Tag().name("Rutina-Ejercicios").description("Asignación de ejercicios a rutinas"),
                        new Tag().name("Progreso").description("Seguimiento del progreso de entrenamientos")));
    }
}