package com.proiect.isi.scheduling.football.games.exceptions;

import java.util.UUID;

public class UnknownPlayerException extends RuntimeException {

    public UnknownPlayerException(UUID playerID) {
        super("Player " + playerID + " is not registered!");
    }
}
