package com.proiect.isi.scheduling.football.games.repositories;

import com.proiect.isi.scheduling.football.games.entities.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TeamRepository extends JpaRepository<Team, UUID> {

    public List<Team> findByMatchId(UUID matchId);
}

