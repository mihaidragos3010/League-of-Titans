package com.proiect.isi.scheduling.football.games.services;

import com.proiect.isi.scheduling.football.games.dto.MatchDto;
import com.proiect.isi.scheduling.football.games.entities.Location;
import com.proiect.isi.scheduling.football.games.entities.Match;
import com.proiect.isi.scheduling.football.games.mapper.MatchMapper;
import com.proiect.isi.scheduling.football.games.repositories.MatchRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final MatchMapper matchMapper;

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

    public void deleteMatch(UUID id){
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Match not found with id: " + id));

        matchRepository.delete(match);
    }

}
