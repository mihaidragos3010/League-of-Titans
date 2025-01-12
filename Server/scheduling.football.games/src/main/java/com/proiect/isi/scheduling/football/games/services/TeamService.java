package com.proiect.isi.scheduling.football.games.services;

import com.proiect.isi.scheduling.football.games.dto.TeamDto;
import com.proiect.isi.scheduling.football.games.entities.Player;
import com.proiect.isi.scheduling.football.games.entities.PlayerTeamBridge;
import com.proiect.isi.scheduling.football.games.entities.PlayerTeamBridgeId;
import com.proiect.isi.scheduling.football.games.entities.Team;
import com.proiect.isi.scheduling.football.games.exceptions.UnknownTeamOrPlayerException;
import com.proiect.isi.scheduling.football.games.mapper.TeamMapper;
import com.proiect.isi.scheduling.football.games.repositories.PlayerRepository;
import com.proiect.isi.scheduling.football.games.repositories.PlayerTeamBridgeRepository;
import com.proiect.isi.scheduling.football.games.repositories.TeamRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;
    private final PlayerTeamBridgeRepository playerTeamBridgeRepository;
    private final TeamMapper teamMapper;

    public UUID addTeam(TeamDto teamDto){
        Team team = teamMapper.convertTeamDtoToTeam(teamDto);
        Team teamSaved = teamRepository.save(team);

        return teamSaved.getId();
    }

    public void addPlayerToTeam(UUID teamId, UUID playerId) throws UnknownTeamOrPlayerException {

        Optional<Team> team = teamRepository.findById(teamId);
        Optional<Player> player = playerRepository.findById(playerId);

        if(team.isPresent() && player.isPresent()){
            PlayerTeamBridgeId bridgeId = new PlayerTeamBridgeId(teamId, playerId);

            PlayerTeamBridge playerTeamBridge = new PlayerTeamBridge();
            playerTeamBridge.setId(bridgeId);
            playerTeamBridge.setTeam(team.get());
            playerTeamBridge.setPlayer(player.get());

            playerTeamBridgeRepository.save(playerTeamBridge);

            return;
        }

        throw new UnknownTeamOrPlayerException(teamId, playerId);
    }

    public List<TeamDto> getAllTeams(){
        return teamRepository.findAll().stream()
                .map(teamMapper::convertTeamToTeamDto)
                .collect(Collectors.toList());
    }

    public List<TeamDto> getTeamsByMatchId(UUID matchId){
        return teamRepository.findByMatchId(matchId).stream()
                .map(teamMapper::convertTeamToTeamDto)
                .collect(Collectors.toList());
    }

    public void deleteTeam(UUID id){
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Team not found with id: " + id));

        teamRepository.delete(team);
    }
}
