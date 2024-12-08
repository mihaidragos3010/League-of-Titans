package com.proiect.isi.scheduling.football.games.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class LocationDto {

    private UUID id;

    @NotEmpty
    private String name;

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

}
