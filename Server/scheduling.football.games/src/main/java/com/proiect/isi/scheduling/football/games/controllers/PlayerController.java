package com.proiect.isi.scheduling.football.games.controllers;

import com.proiect.isi.scheduling.football.games.dto.PlayerDto;
import com.proiect.isi.scheduling.football.games.entities.Player;
import com.proiect.isi.scheduling.football.games.services.AuthService;
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
    private final AuthService authService;

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

    @GetMapping("/players/{playerId}")
    public ResponseEntity<?> getPlayers(@PathVariable UUID playerId,
                                        @CookieValue(name = "AuthToken") String cookie){

        if(cookie.equals("Admin") || authService.checkPlayerCredentials(cookie)) {
            PlayerDto player = playerService.getPlayerById(playerId);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(player);
        }

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .build();
    }

    @GetMapping("/players/team/{teamId}")
    public ResponseEntity<?> getPlayersByTeamId(@PathVariable UUID teamId,
                                                @CookieValue(name = "AuthToken") String cookie){

        if(cookie.equals("Admin") || authService.checkPlayerCredentials(cookie)) {
            List<PlayerDto> players = playerService.getPlayerByTeamId(teamId);

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
