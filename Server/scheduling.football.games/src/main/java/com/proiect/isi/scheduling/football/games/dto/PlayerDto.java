package com.proiect.isi.scheduling.football.games.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.proiect.isi.scheduling.football.games.entities.Rank;
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
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String password;

    private Rank rank;

    private String description;

}
