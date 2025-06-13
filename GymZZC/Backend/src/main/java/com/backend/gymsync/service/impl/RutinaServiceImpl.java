package com.backend.gymsync.service.impl;

import com.backend.gymsync.entity.Rutina;
import com.backend.gymsync.repository.RutinaRepository;
import com.backend.gymsync.service.interfaces.RutinaServiceInterface;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RutinaServiceImpl implements RutinaServiceInterface{

    @Autowired
    private RutinaRepository rutinaRepository;

    @Override
    public List<Rutina> findAll() {
        return rutinaRepository.findAll();
    }

    @Override
    public Optional<Rutina> findById(Integer id) {
        return rutinaRepository.findById(id);
    }

    @Override
    public List<Rutina> findByCliente_Id(Integer clienteId) {
        return rutinaRepository.findByCliente_Id(clienteId);
    }

    @Override
    public List<Rutina> findByEntrenador_Id(Integer entrenadorId) {
        return rutinaRepository.findByEntrenador_Id(entrenadorId);
    }

    @Override
    public Rutina save(Rutina rutina) {
        return rutinaRepository.save(rutina);
    }

    @Override
    public void deleteById(Integer id) {
        rutinaRepository.deleteById(id);
    }
    
    @Override
    public boolean existsById(Integer id) {
        return rutinaRepository.existsById(id);
    }
}