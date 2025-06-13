package com.backend.gymsync.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Configuration
public class JacksonConfig {
    
    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();

        // Soporte para Java 8 (LocalDate, etc.)
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS); // opcional

        // Evitar fallo en propiedades vacías
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);

        // Ignorar propiedades desconocidas
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        // Configurar para manejar referencias circulares (aunque normalmente no es así)
        mapper.configure(SerializationFeature.FAIL_ON_SELF_REFERENCES, false);

        return mapper;
    }
}
