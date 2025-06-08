package com.backend.gymsync.service.interfaces;

import com.backend.gymsync.entity.Usuario;
import java.util.List;
import java.util.Optional;

public interface UsuarioServiceInterface {
    List<Usuario> findAll();
    Optional<Usuario> findById(Integer id);
    List<Usuario> findByNombre(String nombre);
    List<Usuario> findByRol(Usuario.Rol rol);
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    Usuario save(Usuario usuario);
    void deleteById(Integer id);
}