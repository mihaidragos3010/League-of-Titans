package com.proiect.isi.scheduling.football.games.services;

import com.proiect.isi.scheduling.football.games.dto.AuthDto;
import com.proiect.isi.scheduling.football.games.dto.PlayerDto;
import com.proiect.isi.scheduling.football.games.entities.Player;
import com.proiect.isi.scheduling.football.games.mapper.PlayerMapper;
import com.proiect.isi.scheduling.football.games.repositories.PlayerRepository;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.util.Optional;

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

    public ResponseCookie createAndSavePlayerCookie(){
        ResponseCookie cookie = ResponseCookie.from("AuthToken", "Admin")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .build();

        return cookie;
    }

}
