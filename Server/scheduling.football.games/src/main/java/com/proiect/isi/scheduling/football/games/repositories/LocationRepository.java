package com.proiect.isi.scheduling.football.games.repositories;

import com.proiect.isi.scheduling.football.games.entities.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository
public interface LocationRepository extends JpaRepository<Location, UUID>{
}
