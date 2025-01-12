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
    public ResponseEntity<?> postMatch(@Valid @RequestBody MatchDto MatchDto, @CookieValue(name = "AuthToken") String cookie){

        if(cookie.equals("Admin") || cookie.equals("Player")) {
            UUID matchId = matchService.addMatch(MatchDto);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(matchId);
        }
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .build();
    }


    @GetMapping("/matches")
    public ResponseEntity<?> getMatchesByDateRange(
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Optional<Date> startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Optional<Date> endDate,
            @CookieValue(name = "AuthToken") String cookie) {

        if(cookie.equals("Admin") || cookie.equals("Player")) {
            List<MatchDto> matches = new ArrayList<>();
            if (startDate.isEmpty() && endDate.isEmpty()) {
                matches = matchService.getAllMatches();
            }

            if (startDate.isPresent() || endDate.isPresent()) {
                matches = matchService.getMatchesByDateRange(startDate, endDate);
            }

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(matches);
        }
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .build();
    }

    @GetMapping("/matches/{locationdId}")
    public ResponseEntity<?> getMatchesByLocationId(@PathVariable UUID locationdId,
                                                    @CookieValue(name = "AuthToken") String cookie){

        if(cookie.equals("Admin") || cookie.equals("Player")) {
            List<MatchDto> matches = matchService.getMatchesByLocationId(locationdId);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(matches);
        }
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .build();
    }


    @DeleteMapping("/matches")
    public ResponseEntity<?> deleteMatch(@RequestParam UUID id, @CookieValue(name = "AuthToken") String cookie){
        if(cookie.equals("Admin")) {
            matchService.deleteMatch(id);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .build();
        }
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .build();
    }
}
