package com.proiect.isi.scheduling.football.games.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "Teams")
@Getter
@Setter
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "match_Id", nullable = false)
    private Match match;

    @Column
    private Integer minPlayers;

    @Column
    private Integer maxPlayers;
}
