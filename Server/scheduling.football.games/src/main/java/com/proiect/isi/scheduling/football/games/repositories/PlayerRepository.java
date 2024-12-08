package com.proiect.isi.scheduling.football.games.repositories;

import com.proiect.isi.scheduling.football.games.entities.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface PlayerRepository extends JpaRepository<Player, UUID> {

}
