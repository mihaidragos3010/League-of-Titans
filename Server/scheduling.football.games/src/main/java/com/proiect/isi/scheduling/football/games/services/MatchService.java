package com.proiect.isi.scheduling.football.games.services;

import com.proiect.isi.scheduling.football.games.dto.MatchDto;
import com.proiect.isi.scheduling.football.games.dto.TeamDto;
import com.proiect.isi.scheduling.football.games.entities.Match;
import com.proiect.isi.scheduling.football.games.mapper.MatchMapper;
import com.proiect.isi.scheduling.football.games.repositories.MatchRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final MatchMapper matchMapper;
    private final TeamService teamService;
    private final PlayerService playerService;

    public UUID addMatch(MatchDto matchDto){
        Match match = matchMapper.convertMatchDtoToMatch(matchDto);
        Match matchSaved = matchRepository.save(match);

        return matchSaved.getId();
    }

    public Optional<Match> findMatchById(UUID id){
        return matchRepository.findById(id);
    }

    public List<MatchDto> getAllMatches(){
        return matchRepository.findAll().stream()
                .map(matchMapper::convertMatchToMatchDto)
                .collect(Collectors.toList());
    }

    public List<MatchDto> getMatchesByLocationId(UUID locationId){
        return matchRepository.findByLocationId(locationId).stream()
                .map(matchMapper::convertMatchToMatchDto)
                .collect(Collectors.toList());
    }

    public List<MatchDto> getMatchesByDateRange(Optional<Date> startDate, Optional<Date> endDate){

        List<Match> matches = new ArrayList<>();

        if(startDate.isPresent() && endDate.isEmpty()){
            matches = matchRepository.findByStartDate(convertToLondonTimeDate(startDate.get()));
        }

        if(startDate.isEmpty() && endDate.isPresent()){
            matches = matchRepository.findByEndDate(convertToLondonTimeDate(endDate.get()));
        }

        if(startDate.isPresent() && endDate.isPresent()){
            matches = matchRepository.findMatchesWithinRange(convertToLondonTimeDate(startDate.get()),
                                                        convertToLondonTimeDate(endDate.get()));
        }

        return matches.stream()
                .map(matchMapper::convertMatchToMatchDto)
                .collect(Collectors.toList());
    }

    public void deleteMatch(UUID id){
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Match not found with id: " + id));

        matchRepository.delete(match);
    }

    public Date convertToLondonTimeDate(Date date){
        ZonedDateTime londonTime = ZonedDateTime.ofInstant(date.toInstant(), ZoneId.of("Europe/London"));
        Date londonDate = Date.from(londonTime.toInstant());

        return londonDate;
    }


    public List<Map<String, Object>> createProperResponse(List<MatchDto> matches){
        List<Map<String,Object>> response = new ArrayList<>();

        for(MatchDto matchDto : matches){
            Map<String, Object> field = new HashMap<>();

            try {
                TeamDto teamDto1 = teamService.getTeamsByMatchId(matchDto.getId()).get(0);
                Integer countTeam1Players = playerService.getPlayerByTeamId(teamDto1.getId()).size();

                TeamDto teamDto2 = teamService.getTeamsByMatchId(matchDto.getId()).get(1);
                Integer countTeam2Players = playerService.getPlayerByTeamId(teamDto2.getId()).size();

                field.put("match", matchDto);
                field.put("team1", teamDto1);
                field.put("team2", teamDto2);
                field.put("nr_team1_players", countTeam1Players);
                field.put("nr_team2_players", countTeam2Players);
                response.add(field);
            }catch (ArrayIndexOutOfBoundsException ex){
                field.put("ERROR", "Match " + matchDto.getId() + " have too less teams inserted!");
            }
        }

        return response;
    }
}
