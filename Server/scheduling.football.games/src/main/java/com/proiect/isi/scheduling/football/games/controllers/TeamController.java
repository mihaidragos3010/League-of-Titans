package com.proiect.isi.scheduling.football.games.controllers;

import com.proiect.isi.scheduling.football.games.dto.LocationDto;
import com.proiect.isi.scheduling.football.games.dto.TeamDto;
import com.proiect.isi.scheduling.football.games.entities.Player;
import com.proiect.isi.scheduling.football.games.services.TeamService;
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
public class TeamController {

    private final TeamService teamService;

    @PostMapping("/teams")
    public ResponseEntity<?> postTeam(@Valid @RequestBody TeamDto teamDto, @CookieValue(name = "AuthToken") String cookie){

        if(cookie.equals("Admin") || cookie.equals("Player")) {
            UUID locationId = teamService.addTeam(teamDto);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(locationId);
        }
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .build();
    }

    @PostMapping("/teams/join/{teamId}")
    public ResponseEntity<?> joinPlayerATeam(@PathVariable UUID teamId,
                                             @RequestParam UUID playerId,
                                             @CookieValue(name = "AuthToken") String cookie){

        if(cookie.equals("Admin") || cookie.equals("Player")) {
            teamService.addPlayerToTeam(teamId, playerId);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .build();
        }

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .build();
    }


    @GetMapping("/teams")
    public ResponseEntity<?> getAllTeams(@CookieValue(name = "AuthToken") String cookie){

        if(cookie.equals("Admin") || cookie.equals("Player")) {
            List<TeamDto> teams = teamService.getAllTeams();

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(teams);
        }
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .build();
    }

    @GetMapping("/teams/{matchId}")
    public ResponseEntity<?> getAllTeams(@PathVariable UUID matchId,
                                        @CookieValue(name = "AuthToken") String cookie){

        if(cookie.equals("Admin") || cookie.equals("Player")) {
            List<TeamDto> teams = teamService.getTeamsByMatchId(matchId);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(teams);
        }
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .build();
    }

    @DeleteMapping("/teams")
    public ResponseEntity<?> deleteTeam(@RequestParam UUID id, @CookieValue(name = "AuthToken") String cookie){

        if(cookie.equals("Admin")) {
            teamService.deleteTeam(id);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .build();
        }
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .build();
    }

//    @PostMapping("/teams")
//    public ResponseEntity<?> addPlayerToTeam(@RequestParam UUID teamId, @RequestParam UUID playerId){
//
//
//    }
}
