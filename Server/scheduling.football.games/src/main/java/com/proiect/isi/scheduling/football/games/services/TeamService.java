package com.proiect.isi.scheduling.football.games.services;

import com.proiect.isi.scheduling.football.games.dto.MatchDto;
import com.proiect.isi.scheduling.football.games.dto.TeamDto;
import com.proiect.isi.scheduling.football.games.entities.Match;
import com.proiect.isi.scheduling.football.games.entities.Team;
import com.proiect.isi.scheduling.football.games.mapper.TeamMapper;
import com.proiect.isi.scheduling.football.games.repositories.TeamRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMapper teamMapper;

    public UUID addTeam(TeamDto teamDto){
        Team team = teamMapper.convertTeamDtoToTeam(teamDto);
        Team teamSaved = teamRepository.save(team);

        return teamSaved.getId();
    }

    public List<TeamDto> getAllTeams(){
        return teamRepository.findAll().stream()
                .map(teamMapper::convertTeamToTeamDto)
                .collect(Collectors.toList());
    }

    public void deleteTeam(UUID id){
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Team not found with id: " + id));

        teamRepository.delete(team);
    }
}
