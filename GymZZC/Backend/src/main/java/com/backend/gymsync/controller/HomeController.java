package com.backend.gymsync.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        // Endpoint para verificar que el backend está funcionando
        return "Spring Boot está funcionando 🚀";
    }
}
