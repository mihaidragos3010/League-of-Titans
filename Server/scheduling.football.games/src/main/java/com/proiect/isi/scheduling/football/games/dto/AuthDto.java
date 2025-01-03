package com.proiect.isi.scheduling.football.games.dto;

import lombok.Data;
import jakarta.validation.constraints.NotEmpty;

@Data
public class AuthDto {

    @NotEmpty
    private String username;

    @NotEmpty
    private String password;

}
