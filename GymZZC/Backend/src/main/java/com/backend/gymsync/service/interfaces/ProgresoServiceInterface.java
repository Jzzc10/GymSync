package com.backend.gymsync.service.interfaces;

import com.backend.gymsync.entity.Progreso;
import java.util.List;
import java.util.Optional;

public interface ProgresoServiceInterface {
    List<Progreso> findAll();
    Optional<Progreso> findById(Integer id);
    List<Progreso> findByUsuarioId(Integer usuarioId);
    List<Progreso> findByUsuarioIdAndRutinaId(Integer usuarioId, Integer rutinaId);
    List<Progreso> findByUsuarioIdAndEjercicioId(Integer usuarioId, Integer ejercicioId);
    List<Progreso> findByUsuarioIdAndRutinaIdAndEjercicioId(Integer usuarioId, Integer rutinaId, Integer ejercicioId);
    
    // Métodos adicionales del repositorio
    List<Progreso> findByRutinaId(Integer rutinaId);
    List<Progreso> findByEjercicioId(Integer ejercicioId);
    List<Progreso> findByRutinaIdAndEjercicioId(Integer rutinaId, Integer ejercicioId);
    
    Progreso save(Progreso progreso);
    void deleteById(Integer id);
    boolean existsById(Integer id);
}