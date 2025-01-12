package com.proiect.isi.scheduling.football.games.repositories;

import com.proiect.isi.scheduling.football.games.entities.PlayerTeamBridge;
import com.proiect.isi.scheduling.football.games.entities.PlayerTeamBridgeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PlayerTeamBridgeRepository extends JpaRepository<PlayerTeamBridge, PlayerTeamBridgeId> {

    List<PlayerTeamBridge> findByTeamId(UUID teamId);

}
