package com.secwatch.exception;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import java.util.*;
@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(ApiException.class)
    ResponseEntity<?> api(ApiException ex) { return ResponseEntity.status(ex.status).body(Map.of("status",ex.status.value(),"message",ex.getMessage())); }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<?> validation(MethodArgumentNotValidException ex) {
        Map<String,String> fields=new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(e -> fields.putIfAbsent(e.getField(),e.getDefaultMessage()));
        return ResponseEntity.badRequest().body(Map.of("status",400,"message","Veuillez vérifier les champs du formulaire.","errors",fields));
    }
    @ExceptionHandler(HttpMessageNotReadableException.class)
    ResponseEntity<?> malformed() { return ResponseEntity.badRequest().body(Map.of("status",400,"message","Données invalides ou champ non autorisé.")); }
    @ExceptionHandler(AccessDeniedException.class)
    ResponseEntity<?> forbidden() { return ResponseEntity.status(403).body(Map.of("status",403,"message","Vous n’avez pas accès à cette ressource.")); }
    @ExceptionHandler(DataIntegrityViolationException.class)
    ResponseEntity<?> conflict() { return ResponseEntity.status(409).body(Map.of("status",409,"message","Cette adresse email est déjà utilisée.")); }
    @ExceptionHandler(ObjectOptimisticLockingFailureException.class)
    ResponseEntity<?> concurrent() { return ResponseEntity.status(409).body(Map.of("status",409,"message","Cet incident vient d’être modifié. Rechargez la page.")); }
}
