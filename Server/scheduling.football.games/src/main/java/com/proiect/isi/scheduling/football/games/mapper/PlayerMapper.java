package com.proiect.isi.scheduling.football.games.mapper;

import com.proiect.isi.scheduling.football.games.dto.PlayerDto;
import com.proiect.isi.scheduling.football.games.entities.Player;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PlayerMapper {

    @Mapping(target = "rank", constant = "Bronze")
    @Mapping(target = "points", constant = "0L")
    Player convertPlayerDtoToPlayer(PlayerDto playerDto);

    @Mapping(target = "password", expression = "java(null)")
    PlayerDto convertPlayerToPlayerDto(Player player);
}
