package com.backend.gymsync.service.impl;

import com.backend.gymsync.entity.Usuario;
import com.backend.gymsync.repository.UsuarioRepository;
import com.backend.gymsync.service.interfaces.UsuarioServiceInterface;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class UsuarioServiceImpl implements UsuarioServiceInterface {

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    // Patrón regex para validar hashes BCrypt
    private static final Pattern BCRYPT_PATTERN = Pattern.compile("^\\$2[ayb]\\$\\d{2}\\$.{53}$");

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
        if (usuario.getPassword() != null && !usuario.getPassword().trim().isEmpty()) {
            // Solo encriptar si la contraseña no está ya encriptada
            boolean isEncrypted = isPasswordEncrypted(usuario.getPassword());
            System.out.println("Password: " + usuario.getPassword());
            System.out.println("Is encrypted: " + isEncrypted);
            
            if (!isEncrypted) {
                usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
                System.out.println("Password encrypted to: " + usuario.getPassword());
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
    
    // Método mejorado para verificar si una contraseña ya está encriptada
    private boolean isPasswordEncrypted(String password) {
        if (password == null || password.trim().isEmpty()) {
            return false;
        }
        
        // Verificar si coincide con el patrón BCrypt
        return BCRYPT_PATTERN.matcher(password.trim()).matches();
    }
}