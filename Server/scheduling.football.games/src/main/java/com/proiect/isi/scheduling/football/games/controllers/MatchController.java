package com.proiect.isi.scheduling.football.games.controllers;

import com.proiect.isi.scheduling.football.games.dto.MatchDto;
import com.proiect.isi.scheduling.football.games.services.MatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.ZonedDateTime;

import java.time.ZoneId;
import java.util.*;

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
    public ResponseEntity<?> getMatchesByDateRange(
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Optional<Date> startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Optional<Date> endDate) {

        List<MatchDto> matches = new ArrayList<>();
        if(startDate.isEmpty() && endDate.isEmpty()){
            matches = matchService.getAllMatches();
        }

        if(startDate.isPresent() || endDate.isPresent()) {
            matches = matchService.getMatchesByDateRange(startDate, endDate);
        }

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
