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
    public ResponseEntity<?> postTeam(@Valid @RequestBody TeamDto teamDto){

        UUID locationId = teamService.addTeam(teamDto);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(locationId);
    }

    @GetMapping("/teams")
    public ResponseEntity<?> getAllTeams(){

        List<TeamDto> teams = teamService.getAllTeams();

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(teams);
    }

    @DeleteMapping("/teams")
    public ResponseEntity<?> deleteTeam(@RequestParam UUID id){

        teamService.deleteTeam(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

//    @PostMapping("/teams")
//    public ResponseEntity<?> addPlayerToTeam(@RequestParam UUID teamId, @RequestParam UUID playerId){
//
//
//    }
}
