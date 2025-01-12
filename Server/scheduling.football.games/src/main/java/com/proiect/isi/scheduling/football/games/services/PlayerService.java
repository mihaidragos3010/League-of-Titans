package com.proiect.isi.scheduling.football.games.services;

import com.proiect.isi.scheduling.football.games.dto.PlayerDto;
import com.proiect.isi.scheduling.football.games.entities.Match;
import com.proiect.isi.scheduling.football.games.entities.Player;
import com.proiect.isi.scheduling.football.games.entities.PlayerTeamBridge;
import com.proiect.isi.scheduling.football.games.exceptions.UnknownPlayerException;
import com.proiect.isi.scheduling.football.games.mapper.PlayerMapper;
import com.proiect.isi.scheduling.football.games.repositories.PlayerRepository;
import com.proiect.isi.scheduling.football.games.repositories.PlayerTeamBridgeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final PlayerMapper playerMapper;
    private final PlayerTeamBridgeRepository playerTeamBridgeRepository;

    public void addPlayer(PlayerDto playerDto){
        Player player = playerMapper.convertPlayerDtoToPlayer(playerDto);
        playerRepository.save(player);
    }

    public List<Player> getAllPlayers(){
        return playerRepository.findAll();
    }

    public PlayerDto getPlayerById(UUID playerId) throws UnknownPlayerException{
        Optional<Player> player = playerRepository.findById(playerId);
        if(player.isPresent()) {
            return playerMapper.convertPlayerToPlayerDto(player.get());
        }

        throw new UnknownPlayerException(playerId);
    }

    public List<PlayerDto> getPlayerByTeamId(UUID teamId){
        List<PlayerTeamBridge> playerTeamBridges = playerTeamBridgeRepository.findByTeamId(teamId);
        List<Player> players = playerTeamBridges.stream()
                .map(elem -> playerRepository.findById(elem.getId().getPlayerId()))
                .flatMap(Optional::stream)
                .collect(Collectors.toList());

        return players.stream()
                .map(playerMapper::convertPlayerToPlayerDto)
                .collect(Collectors.toList());
    }

    public void deletePlayer(UUID playerId){
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new EntityNotFoundException("Player not found with id: " + playerId));

        playerRepository.delete(player);
    }
}
