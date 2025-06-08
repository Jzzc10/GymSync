package com.backend.gymsync.repository;

import com.backend.gymsync.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    List<Usuario> findByNombreContainingIgnoreCase(String nombre);
    List<Usuario> findByRol(Usuario.Rol rol);
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
}

