package com.proiect.isi.scheduling.football.games.services;

import com.proiect.isi.scheduling.football.games.dto.PlayerDto;
import com.proiect.isi.scheduling.football.games.entities.Player;
import com.proiect.isi.scheduling.football.games.mapper.PlayerMapper;
import com.proiect.isi.scheduling.football.games.repositories.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final PlayerMapper playerMapper;

    public void addPlayer(PlayerDto playerDto){

        Player player = playerMapper.convertPlayerDtoToPlayer(playerDto);
        playerRepository.save(player);
    }
}
