package com.proiect.isi.scheduling.football.games.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class PlayerDto {

    @NotEmpty
    private String username;

    @NotEmpty
    @Email(message = "Invalid email format")
    private String email;

    @NotEmpty
    private String password;

}
