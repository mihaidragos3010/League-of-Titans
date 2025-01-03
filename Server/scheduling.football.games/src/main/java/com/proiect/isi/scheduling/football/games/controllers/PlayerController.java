package com.proiect.isi.scheduling.football.games.controllers;

import com.proiect.isi.scheduling.football.games.dto.PlayerDto;
import com.proiect.isi.scheduling.football.games.entities.Player;
import com.proiect.isi.scheduling.football.games.services.PlayerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("api")
public class PlayerController {

    private final PlayerService playerService;

    @GetMapping("/players")
    public ResponseEntity<?> getPlayers(@CookieValue(name = "AuthToken") String cookie){

        if(cookie.equals("Admin")) {
            List<Player> players = playerService.getAllPlayers();

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(players);
        }
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .build();
    }

    @DeleteMapping("/players/{playerId}")
    public ResponseEntity<?> postPlayer(@PathVariable UUID playerId, @CookieValue(name = "AuthToken") String cookie){

        if(cookie.equals("Admin")) {
            playerService.deletePlayer(playerId);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .build();
        }
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .build();
    }
}
