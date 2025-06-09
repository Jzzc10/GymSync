package com.backend.gymsync.service.interfaces;

import com.backend.gymsync.entity.Rutina;
import java.util.List;
import java.util.Optional;

public interface RutinaServiceInterface {
    List<Rutina> findAll();
    Optional<Rutina> findById(Integer id);
    List<Rutina> findByCliente_Id(Integer clienteId);
    List<Rutina> findByEntrenador_Id(Integer entrenadorId);
    Rutina save(Rutina rutina);
    void deleteById(Integer id);
    boolean existsById(Integer id);
}