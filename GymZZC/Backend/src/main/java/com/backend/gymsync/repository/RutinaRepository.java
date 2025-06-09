package com.backend.gymsync.repository;

import com.backend.gymsync.entity.Rutina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RutinaRepository extends JpaRepository<Rutina, Integer> {
    List<Rutina> findByCliente_Id(Integer clienteId);
    List<Rutina> findByEntrenador_Id(Integer entrenadorId);
}