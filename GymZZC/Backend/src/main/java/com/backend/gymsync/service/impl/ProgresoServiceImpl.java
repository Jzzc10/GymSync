package com.backend.gymsync.service.impl;

import com.backend.gymsync.entity.Progreso;
import com.backend.gymsync.repository.ProgresoRepository;
import com.backend.gymsync.service.interfaces.ProgresoServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProgresoServiceImpl implements ProgresoServiceInterface {

    @Autowired
    private ProgresoRepository progresoRepository;

    @Override
    public List<Progreso> findAll() {
        return progresoRepository.findAll();
    }

    @Override
    public Optional<Progreso> findById(Integer id) {
        return progresoRepository.findById(id);
    }

    @Override
    public List<Progreso> findByUsuarioId(Integer usuarioId) {
        return progresoRepository.findByUsuarioId(usuarioId);
    }

    @Override
    public List<Progreso> findByUsuarioIdAndRutinaId(Integer usuarioId, Integer rutinaId) {
        return progresoRepository.findByUsuarioIdAndRutinaId(usuarioId, rutinaId);
    }

    @Override
    public List<Progreso> findByUsuarioIdAndEjercicioId(Integer usuarioId, Integer ejercicioId) {
        return progresoRepository.findByUsuarioIdAndEjercicioId(usuarioId, ejercicioId);
    }

    @Override
    public List<Progreso> findByUsuarioIdAndRutinaIdAndEjercicioId(Integer usuarioId, Integer rutinaId, Integer ejercicioId) {
        return progresoRepository.findByUsuarioIdAndRutinaIdAndEjercicioId(usuarioId, rutinaId, ejercicioId);
    }

    @Override
    public List<Progreso> findByRutinaId(Integer rutinaId) {
        return progresoRepository.findByRutinaId(rutinaId);
    }

    @Override
    public List<Progreso> findByEjercicioId(Integer ejercicioId) {
        return progresoRepository.findByEjercicioId(ejercicioId);
    }

    @Override
    public List<Progreso> findByRutinaIdAndEjercicioId(Integer rutinaId, Integer ejercicioId) {
        return progresoRepository.findByRutinaIdAndEjercicioId(rutinaId, ejercicioId);
    }

    @Override
    public Progreso save(Progreso progreso) {
        return progresoRepository.save(progreso);
    }

    @Override
    public void deleteById(Integer id) {
        progresoRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Integer id) {
        return progresoRepository.existsById(id);
    }
}