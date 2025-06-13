package com.backend.gymsync.service.impl;

import com.backend.gymsync.entity.RutinaEjercicio;
import com.backend.gymsync.entity.RutinaEjercicioId;
import com.backend.gymsync.repository.RutinaEjercicioRepository;
import com.backend.gymsync.service.interfaces.RutinaEjercicioServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RutinaEjercicioServiceImpl implements RutinaEjercicioServiceInterface {

    @Autowired
    private RutinaEjercicioRepository rutinaEjercicioRepository;

    @Override
    public List<RutinaEjercicio> findByRutinaId(Integer rutinaId) {
        // Usar el método correcto del repositorio
        return rutinaEjercicioRepository.findByRutina_Id(rutinaId);
    }

    @Override
    public Optional<RutinaEjercicio> findById(RutinaEjercicioId id) {
        return rutinaEjercicioRepository.findById(id);
    }

    @Override
    public RutinaEjercicio save(RutinaEjercicio rutinaEjercicio) {
        return rutinaEjercicioRepository.save(rutinaEjercicio);
    }

    @Override
    public void deleteById(RutinaEjercicioId id) {
        rutinaEjercicioRepository.deleteById(id);
    }

    @Override
    public boolean existsById(RutinaEjercicioId id) {
        return rutinaEjercicioRepository.existsById(id);
    }

    // Métodos adicionales que puedes necesitar (no están en la interfaz)
    public List<RutinaEjercicio> findByEjercicioId(Integer ejercicioId) {
        return rutinaEjercicioRepository.findByEjercicio_Id(ejercicioId);
    }

    public List<RutinaEjercicio> findAll() {
        return rutinaEjercicioRepository.findAll();
    }

    // Métodos de conveniencia
    public void eliminar(Integer rutinaId, Integer ejercicioId) {
        RutinaEjercicioId id = new RutinaEjercicioId(rutinaId, ejercicioId);
        deleteById(id);
    }

    public RutinaEjercicio obtenerPorId(Integer rutinaId, Integer ejercicioId) {
        RutinaEjercicioId id = new RutinaEjercicioId(rutinaId, ejercicioId);
        return findById(id).orElse(null);
    }
}