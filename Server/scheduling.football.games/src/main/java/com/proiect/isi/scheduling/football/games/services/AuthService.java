package com.proiect.isi.scheduling.football.games.services;

import com.proiect.isi.scheduling.football.games.dto.AuthDto;
import com.proiect.isi.scheduling.football.games.dto.PlayerDto;
import com.proiect.isi.scheduling.football.games.entities.Player;
import com.proiect.isi.scheduling.football.games.mapper.PlayerMapper;
import com.proiect.isi.scheduling.football.games.repositories.PlayerRepository;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final PlayerRepository playerRepository;
    private final PlayerMapper playerMapper;

    public Optional<PlayerDto> getPlayerCredentials(AuthDto authDto){

        Optional<Player> player = playerRepository.findByUsernameAndPassword(
                                            authDto.getUsername(),
                                            authDto.getPassword());

        if(player.isPresent())
            return player.map(playerMapper::convertPlayerToPlayerDto);

        return Optional.empty();
    }

    public ResponseCookie createAndSaveAdminCookie(){

        ResponseCookie cookie = ResponseCookie.from("AuthToken", "Admin")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .build();

        return cookie;
    }

    public ResponseCookie createAndSavePlayerCookie(AuthDto authDto){

        Player player = playerRepository.findByUsernameAndPassword(
                authDto.getUsername(),
                authDto.getPassword()).get();

        ResponseCookie cookie = ResponseCookie.from("AuthToken", player.getId().toString())
                .httpOnly(true)
                .secure(false)
                .path("/")
                .build();

        return cookie;
    }

    public boolean checkPlayerCredentials(String cookie){
        try {
            UUID playerId = UUID.fromString(cookie);
            Optional<Player> player = playerRepository.findById(playerId);
            if(player.isPresent()){
                return true;
            }
        }catch (Exception e){
            log.info("Cookie " + cookie + " is not in correctFormat");
        }

        return false;
    }

}
