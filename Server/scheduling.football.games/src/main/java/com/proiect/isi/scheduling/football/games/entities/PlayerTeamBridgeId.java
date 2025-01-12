package com.proiect.isi.scheduling.football.games.entities;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;
import java.util.UUID;

@Data
@Embeddable
public class PlayerTeamBridgeId implements Serializable {
    private UUID teamId;
    private UUID playerId;

    public PlayerTeamBridgeId() {}

    public PlayerTeamBridgeId(UUID teamId, UUID playerId){
        this.teamId = teamId;
        this.playerId = playerId;
    }
}
