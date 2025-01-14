package com.proiect.isi.scheduling.football.games.controllers;

import com.proiect.isi.scheduling.football.games.dto.AuthDto;
import com.proiect.isi.scheduling.football.games.dto.PlayerDto;
import com.proiect.isi.scheduling.football.games.services.AuthService;
import com.proiect.isi.scheduling.football.games.services.PlayerService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final PlayerService playerService;
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> loginPlayer(@Valid @RequestBody AuthDto authDto, HttpServletResponse response){

        if(authDto.getUsername().equals("admin") || authDto.getPassword().equals("admin")){
            ResponseCookie cookie = authService.createAndSaveAdminCookie();
            response.addHeader("Set-Cookie", cookie.toString());
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .build();
        }

        Optional<PlayerDto> playerDto = authService.getPlayerCredentials(authDto);
        if(playerDto.isPresent()){
            ResponseCookie cookie = authService.createAndSavePlayerCookie(authDto);
            response.addHeader("Set-Cookie", cookie.toString());
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .build();
        }

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .build();
    }

    @PostMapping("/registry")
    public ResponseEntity<?> registryPlayer(@Valid @RequestBody PlayerDto playerDto){

        playerService.addPlayer(playerDto);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }
}
