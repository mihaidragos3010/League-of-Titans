package com.proiect.isi.scheduling.football.games.handlers;

import com.proiect.isi.scheduling.football.games.exceptions.UnknownPlayerException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleEntityNotFoundException(EntityNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ex.getMessage());
    }

    @ExceptionHandler(UnknownPlayerException.class)
    public ResponseEntity<String> handleUnknownPlayerException(UnknownPlayerException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleSQLServerException(Exception ex) {
        // Return a meaningful message and status
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("A database error occurred: " + ex.getMessage());
    }

}
