package com.backend.gymsync.service.impl;

import com.backend.gymsync.entity.Ejercicio;
import com.backend.gymsync.repository.EjercicioRepository;
import com.backend.gymsync.service.interfaces.EjercicioServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EjercicioServiceImpl implements EjercicioServiceInterface {

    @Autowired
    private EjercicioRepository ejercicioRepository; // Inyección del repositorio JPA

    @Override
    public List<Ejercicio> findAll() {
        return ejercicioRepository.findAll(); // SELECT * FROM ejercicios
    }

    @Override
    public Optional<Ejercicio> findById(Integer id) {
        return ejercicioRepository.findById(id); // SELECT por ID
    }

    @Override
    public Ejercicio save(Ejercicio ejercicio) {
        return ejercicioRepository.save(ejercicio); // INSERT/UPDATE
    }

    @Override
    public void deleteById(Integer id) {
        ejercicioRepository.deleteById(id); // DELETE por ID
    }

    @Override
    public boolean existsById(Integer id) {
        return ejercicioRepository.existsById(id);
    }
}