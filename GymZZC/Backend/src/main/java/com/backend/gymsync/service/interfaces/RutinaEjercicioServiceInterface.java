package com.backend.gymsync.service.interfaces;

import com.backend.gymsync.entity.RutinaEjercicio;
import com.backend.gymsync.entity.RutinaEjercicioId;
import java.util.List;
import java.util.Optional;

public interface RutinaEjercicioServiceInterface {
    List<RutinaEjercicio> findByRutinaId(Integer rutinaId);
    Optional<RutinaEjercicio> findById(RutinaEjercicioId id);
    RutinaEjercicio save(RutinaEjercicio rutinaEjercicio);
    void deleteById(RutinaEjercicioId id);
    boolean existsById(RutinaEjercicioId id);
}