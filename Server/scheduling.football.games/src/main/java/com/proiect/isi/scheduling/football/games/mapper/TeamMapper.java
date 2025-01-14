package com.proiect.isi.scheduling.football.games.mapper;

import com.proiect.isi.scheduling.football.games.dto.TeamDto;
import com.proiect.isi.scheduling.football.games.entities.Team;
import com.proiect.isi.scheduling.football.games.services.MatchService;
import jakarta.persistence.EntityNotFoundException;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.UUID;
import com.proiect.isi.scheduling.football.games.entities.Match;
import org.springframework.context.annotation.Lazy;

@Mapper(componentModel = "spring")
public abstract class TeamMapper {

    @Autowired
    @Lazy
    private MatchService matchService;

    @Mapping(target = "match", source = "matchId", qualifiedByName = "mapMatchIdToMatch")
    public abstract Team convertTeamDtoToTeam(TeamDto teamDto);

    @Mapping(target = "matchId", source = "match", qualifiedByName = "mapMatchToMatchId")
    public abstract TeamDto convertTeamToTeamDto(Team team);

    @Named("mapMatchIdToMatch")
    protected Match mapMatchIdToMatch(UUID matchId) {
        return matchService.findMatchById(matchId)
                .orElseThrow(() -> new EntityNotFoundException("Match not found with ID: " + matchId));
    }

    @Named("mapMatchToMatchId")
    protected UUID mapMatchToMatchId(Match match) {
        return match.getId();
    }
}




