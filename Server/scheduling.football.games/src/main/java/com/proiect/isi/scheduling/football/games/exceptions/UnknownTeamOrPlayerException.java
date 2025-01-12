package com.proiect.isi.scheduling.football.games.exceptions;

import java.util.UUID;

public class UnknownTeamOrPlayerException extends RuntimeException{
    public UnknownTeamOrPlayerException(UUID teamId, UUID playerID) {
        super("Player " + playerID + " or Team " + teamId + " are unknown!");
    }
}
