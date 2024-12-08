package com.proiect.isi.scheduling.football.games.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class TeamDto {

    private UUID id;

    @NotNull
    private UUID matchId;

    private Integer minPlayers;

    private Integer maxPlayers;

}
