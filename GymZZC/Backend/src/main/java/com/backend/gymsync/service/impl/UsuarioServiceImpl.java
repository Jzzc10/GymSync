package com.backend.gymsync.service.impl;

import com.backend.gymsync.entity.Usuario;
import com.backend.gymsync.repository.UsuarioRepository;
import com.backend.gymsync.service.interfaces.UsuarioServiceInterface;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServiceImpl implements UsuarioServiceInterface {

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    @Override
    public Optional<Usuario> findById(Integer id) {
        return usuarioRepository.findById(id);
    }

    @Override
    public List<Usuario> findByNombre(String nombre) {
        return usuarioRepository.findByNombreContainingIgnoreCase(nombre);
    }

    @Override
    public List<Usuario> findByRol(Usuario.Rol rol) {
        return usuarioRepository.findByRol(rol);
    }

    @Override
    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Override
    public boolean existsByEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }

    @Override
    public Usuario save(Usuario usuario) {
        // Encriptar la contraseña antes de guardar
        if (usuario.getPassword() != null && !usuario.getPassword().isEmpty()) {
            // Solo encriptar si la contraseña no está ya encriptada
            if (!isPasswordEncrypted(usuario.getPassword())) {
                usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
            }
        }
        return usuarioRepository.save(usuario);
    }

    @Override
    public void deleteById(Integer id) {
        usuarioRepository.deleteById(id);
    }
    
    // Método adicional para verificar contraseñas
    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
    
    // Método para verificar si una contraseña ya está encriptada
    private boolean isPasswordEncrypted(String password) {
        // BCrypt hashes always start with $2a$, $2b$, or $2y$
        return password.startsWith("$2a$") || password.startsWith("$2b$") || password.startsWith("$2y$");
    }
}