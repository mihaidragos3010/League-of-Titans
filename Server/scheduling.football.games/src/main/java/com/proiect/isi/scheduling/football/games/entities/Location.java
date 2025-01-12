package com.proiect.isi.scheduling.football.games.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "Locations")
@Getter
@Setter
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true)
    private String name;

    @Column(unique = true)
    private String address;

    @Column(nullable = false, unique = true)
    private Double latitude;

    @Column(nullable = false, unique = true)
    private Double longitude;

    @OneToMany(mappedBy = "location", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Match> matches;


}
