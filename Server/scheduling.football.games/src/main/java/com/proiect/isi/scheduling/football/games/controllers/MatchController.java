package com.proiect.isi.scheduling.football.games.controllers;

import com.proiect.isi.scheduling.football.games.dto.MatchDto;
import com.proiect.isi.scheduling.football.games.entities.Match;
import com.proiect.isi.scheduling.football.games.services.MatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("api")
public class MatchController {

    private final MatchService matchService;

    @PostMapping("/matches")
    public ResponseEntity<?> postMatch(@Valid @RequestBody MatchDto MatchDto){

        UUID matchId = matchService.addMatch(MatchDto);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(matchId);
    }

    @GetMapping("/matches")
    public ResponseEntity<?> getMatches(){

        List<MatchDto> matches = matchService.getAllMatches();

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(matches);
    }

    @DeleteMapping("/matches")
    public ResponseEntity<?> deleteMatch(@RequestParam UUID id){
        matchService.deleteMatch(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }
}
