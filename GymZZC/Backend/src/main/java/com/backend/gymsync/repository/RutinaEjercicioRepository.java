package com.backend.gymsync.repository;

import com.backend.gymsync.entity.RutinaEjercicio;
import com.backend.gymsync.entity.RutinaEjercicioId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RutinaEjercicioRepository extends JpaRepository<RutinaEjercicio, RutinaEjercicioId> {
    
    // Método principal que usa tu servicio
    List<RutinaEjercicio> findByRutina_Id(Integer rutinaId);
    
    // Para buscar por ejercicio
    List<RutinaEjercicio> findByEjercicio_Id(Integer ejercicioId);
    
    // Para buscar por ambos (rutina y ejercicio)
    List<RutinaEjercicio> findByRutina_IdAndEjercicio_Id(Integer rutinaId, Integer ejercicioId);
    
    // Alternativa usando @Query (por si necesitas mayor claridad)
    @Query("SELECT re FROM RutinaEjercicio re WHERE re.rutina.id = :rutinaId")
    List<RutinaEjercicio> findEjerciciosByRutinaId(@Param("rutinaId") Integer rutinaId);
}