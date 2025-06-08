package com.backend.gymsync.service.interfaces;

import com.backend.gymsync.entity.Rutina;
import java.util.List;
import java.util.Optional;

public interface RutinaServiceInterface {
    List<Rutina> findAll();
    Optional<Rutina> findById(Integer id);
    List<Rutina> findByClienteId(Integer clienteId);
    List<Rutina> findByEntrenadorId(Integer entrenadorId);
    Rutina save(Rutina rutina);
    void deleteById(Integer id);
    boolean existsById(Integer id);
}