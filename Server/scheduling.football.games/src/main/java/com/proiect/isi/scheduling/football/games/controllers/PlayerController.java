package com.proiect.isi.scheduling.football.games.controllers;

import com.proiect.isi.scheduling.football.games.dto.PlayerDto;
import com.proiect.isi.scheduling.football.games.services.PlayerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor

public class PlayerController {

    private final PlayerService playerService;

    @PostMapping("/players")
    public ResponseEntity<?> postPlayer(@Valid @RequestBody PlayerDto playerDto){

        playerService.addPlayer(playerDto);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }
}
